/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/modules/chat/chat.controller.ts
import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // GET /chat/rooms — get all rooms for current user
  @Get('rooms')
  getUserRooms(@Req() req: any) {
    const userId = req.user.sub || req.user.userId;
    return this.chatService.getUserRooms(userId);
  }

  // POST /chat/rooms/:userId — start a DM with someone
  @Post('rooms/:userId')
  createRoom(@Req() req: any, @Param('userId') otherUserId: string) {
    const userId = req.user.sub || req.user.userId;
    return this.chatService.getOrCreateRoom(userId, otherUserId);
  }

  // GET /chat/rooms/:roomId/messages — get message history
  @Get('rooms/:roomId/messages')
  getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }
}
