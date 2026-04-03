/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('rooms')
  async getUserRooms(@Req() req: any) {
    // Standardizing userId extraction from JWT payload
    const userId = req.user.userId;
    return this.conversationService.getUserRooms(userId);
  }

  @Get('unread')
  async getUnread(@Req() req: any) {
    const userId = req.user.userId;
    return this.conversationService.getUnreadMessageCount(userId);
  }

  // POST /conversation/rooms/:userId — start or get a DM with someone
  @Post('rooms/:userId')
  async createRoom(@Req() req: any, @Param('userId') otherUserId: string) {
    const userId = req.user.userId;
    return this.conversationService.getOrCreateRoom(userId, otherUserId);
  }

  // GET /conversation/rooms/:roomId — get a single room
  @Get('rooms/:roomId')
  async getRoom(@Req() req: any, @Param('roomId') roomId: string) {
    const userId = req.user.userId;
    return this.conversationService.getRoom(roomId, userId);
  }

  // GET /conversation/rooms/:roomId/messages — get message history
  @Get('rooms/:roomId/messages')
  async getMessages(
    @Req() req: any,
    @Param('roomId') roomId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.userId;
    return this.conversationService.getMessages(
      roomId,
      userId,
      cursor,
      limit ? parseInt(limit) : 30,
    );
  }

  // DELETE /conversation/rooms/:roomId — delete a conversation
  @Delete('rooms/:roomId')
  async deleteRoom(@Req() req: any, @Param('roomId') roomId: string) {
    const userId = req.user.userId;
    return this.conversationService.deleteRoom(roomId, userId);
  }
}
