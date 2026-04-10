/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
  firstName?: string;
  district?: string;
  iat?: number;
  exp?: number;
}

interface SocketData {
  userId: string;
}

interface SendMessageDto {
  roomId: string;
  content: string;
  receiverId?: string;
}

interface JoinRoomDto {
  roomId: string;
}

interface TypingDto {
  roomId: string;
  isTyping: boolean;
}

interface MarkReadDto {
  roomId: string;
}

/** Match HTTP CORS: dev allows localhost + 127.0.0.1 so Socket.IO works from any dev URL. */
function chatSocketCorsOrigin(): string | string[] {
  const primary = process.env.FRONTEND_URL || 'http://localhost:3000';
  if (process.env.PRODUCTION_MODE === 'true') {
    return primary;
  }
  return Array.from(
    new Set([
      primary,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ]),
  );
}

@WebSocketGateway({
  cors: {
    origin: chatSocketCorsOrigin(),
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  /** userId → socket ids (multiple tabs / clients per user). */
  private connectedUsers = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private emitToUser(userId: string, event: string, payload: unknown): void {
    const sockets = this.connectedUsers.get(userId);
    if (!sockets?.size) return;
    for (const sid of sockets) {
      this.server.to(sid).emit(event, payload);
    }
  }

  async handleConnection(client: Socket & { data: SocketData }): Promise<void> {
    try {
      const token =
        (client.handshake.auth as Record<string, string>)?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);
      client.data.userId = payload.sub;

      let set = this.connectedUsers.get(payload.sub);
      if (!set) {
        set = new Set<string>();
        this.connectedUsers.set(payload.sub, set);
      }
      set.add(client.id);

      console.log(`User ${payload.sub} connected: ${client.id}`);

      this.server.to(client.id).emit('connected', { userId: payload.sub });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket & { data: SocketData }): void {
    const userId = client.data?.userId;
    if (userId) {
      const set = this.connectedUsers.get(userId);
      if (set) {
        set.delete(client.id);
        if (set.size === 0) this.connectedUsers.delete(userId);
      }
    }
    console.log(`User ${userId ?? 'unknown'} disconnected`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket & { data: SocketData },
    @MessageBody() data: JoinRoomDto,
  ): void {
    void client.join(data.roomId);
    client.emit('joined_room', { roomId: data.roomId });
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket & { data: SocketData },
    @MessageBody() data: SendMessageDto,
  ): Promise<void> {
    const senderId = client.data.userId;

    const room = await this.prisma.room.findFirst({
      where: {
        id: data.roomId,
        members: { some: { id: senderId } },
      },
      select: { members: { select: { id: true } } },
    });

    if (!room) {
      client.emit('error', { message: 'Room not found' });
      return;
    }

    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        senderId,
        roomId: data.roomId,
      },
      include: {
        sender: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Deliver to every member socket (feed, messages list, or open chat — no join_room required)
    for (const { id } of room.members) {
      this.emitToUser(id, 'new_message', message);
    }

    for (const { id } of room.members) {
      if (id === senderId) continue;
      this.emitToUser(id, 'notification', {
        type: 'new_message',
        from: senderId,
        roomId: data.roomId,
        preview: data.content.slice(0, 50),
      });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket & { data: SocketData },
    @MessageBody() data: TypingDto,
  ): void {
    client.to(data.roomId).emit('user_typing', {
      userId: client.data.userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket & { data: SocketData },
    @MessageBody() data: MarkReadDto,
  ): Promise<void> {
    await this.prisma.message.updateMany({
      where: {
        roomId: data.roomId,
        senderId: { not: client.data.userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    client.to(data.roomId).emit('messages_read', {
      roomId: data.roomId,
      readBy: client.data.userId,
    });

    const room = await this.prisma.room.findFirst({
      where: { id: data.roomId },
      select: { members: { select: { id: true } } },
    });
    for (const { id } of room?.members ?? []) {
      if (id === client.data.userId) continue;
      this.emitToUser(id, 'messages_read', {
        roomId: data.roomId,
        readBy: client.data.userId,
      });
    }
  }
}
