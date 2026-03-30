/* eslint-disable prettier/prettier */
// src/modules/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

    // Get or create a 1:1 room between two users
    async getOrCreateRoom(userAId: string, userBId: string) {
        const sorted = [userAId, userBId].sort();
        const roomKey = sorted.join('_');

        let room = await this.prisma.room.findUnique({
            where: { roomKey },
            include: { members: true },
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
                include: { members: true },
            });
        }

        return { success: true, data: room };
    }

    // Get message history for a room
    async getMessages(roomId: string, cursor?: string, limit = 30) {
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
            data: messages.reverse(),
        };
    }

    // Get all rooms for a user
    async getUserRooms(userId: string) {
        const rooms = await this.prisma.room.findMany({
            where: {
                members: { some: { id: userId } },
            },
            include: {
                members: {
                    where: { id: { not: userId } },
                    select: { id: true, first_name: true, last_name: true, avatarUrl: true },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // last message preview
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return { success: true, data: rooms };
    }
}