import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateRoom(userAId: string, userBId: string) {
    const sorted = [userAId, userBId].sort();
    const roomKey = sorted.join('_');

    let room = await this.prisma.room.findUnique({
      where: { roomKey },
      include: {
        members: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatarUrl: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      room = await this.prisma.room.create({
        data: {
          roomKey,
          type: 'DIRECT',
          members: {
            connect: [{ id: userAId }, { id: userBId }],
          },
        },
        include: {
          members: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              avatarUrl: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            // ADD THIS INCLUDE BLOCK TO MATCH findUnique
            include: {
              sender: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
      });
    }

    return { success: true, data: room };
  }

  // Get all rooms for a user
  async getUserRooms(userId: string) {
    const rooms = await this.prisma.room.findMany({
      where: {
        members: { some: { id: userId } },
      },
      include: {
        members: {
          where: { id: { not: userId } }, // only return the other person
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatarUrl: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // last message preview
          include: {
            sender: {
              select: { id: true, first_name: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (rooms.length === 0) {
      return { success: true, data: [] };
    }

    const roomIds = rooms.map((r) => r.id);
    const unreadGroups = await this.prisma.message.groupBy({
      by: ['roomId'],
      where: {
        roomId: { in: roomIds },
        readAt: null,
        senderId: { not: userId },
      },
      _count: { _all: true },
    });
    const unreadByRoom = new Map(
      unreadGroups.map((g) => [g.roomId, g._count._all]),
    );

    const data = rooms.map((room) => ({
      ...room,
      unreadCount: unreadByRoom.get(room.id) ?? 0,
    }));

    return { success: true, data };
  }

  /** Messages from others in rooms the user belongs to, not yet marked read. */
  async getUnreadMessageCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        readAt: null,
        senderId: { not: userId },
        room: {
          members: { some: { id: userId } },
        },
      },
    });
    return { success: true, data: { count } };
  }

  // Get message history for a room with cursor-based pagination
  async getMessages(
    roomId: string,
    userId: string,
    cursor?: string,
    limit = 30,
  ) {
    // verify user is a member of the room
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
        members: { some: { id: userId } },
      },
    });

    if (!room)
      throw new ForbiddenException('You are not a member of this room');

    const messages = await this.prisma.message.findMany({
      where: { roomId },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
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

    return {
      success: true,
      data: messages.reverse(), // oldest first
      nextCursor: messages.length === limit ? messages[0].id : null,
    };
  }

  // Get a single room by id
  async getRoom(roomId: string, userId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
        members: { some: { id: userId } },
      },
      include: {
        members: {
          where: { id: { not: userId } },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    return { success: true, data: room };
  }

  // Delete a room (only if user is a member)
  async deleteRoom(roomId: string, userId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
        members: { some: { id: userId } },
      },
    });

    if (!room)
      throw new ForbiddenException('You are not a member of this room');

    // delete messages first (FK constraint)
    await this.prisma.message.deleteMany({ where: { roomId } });
    await this.prisma.room.delete({ where: { id: roomId } });

    return { success: true, message: 'Conversation deleted' };
  }
}
