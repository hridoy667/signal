/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVotingDto } from './dto/create-voting.dto';
import { UpdateVotingDto } from './dto/update-voting.dto';
import { PrismaService } from '../prisma/prisma.service';
// Look for where you import PrismaClient, and add 'vote' (the enum name)
import { PrismaClient, vote, vote as VoteEnum } from '@prisma/client';
@Injectable()
export class VotingService {


  constructor(private readonly prisma: PrismaService) { }

  // voting.service.ts
  async vote(userId: string, createVotingDto: CreateVotingDto) {
    const { postId, vote: voteType } = createVotingDto;
    await this.prisma.$transaction(async (tx) => {
      const existingVote = await tx.postVote.findUnique({
        where: {
          // ← you need a unique constraint on [userId, postId]
          // check your schema has @@unique([userId, postId])
          userId_postId: { userId, postId },
        },
      });

      if (existingVote) {
        if (existingVote.vote === voteType) {
          // Same vote — remove it (toggle off)
          await tx.postVote.delete({
            where: { userId_postId: { userId, postId } },
          });
          await tx.post.update({
            where: { id: postId },
            data: {
              upvoats: voteType === 'UPVOTE' ? { decrement: 1 } : undefined,
              downvoats: voteType === 'DOWNVOTE' ? { decrement: 1 } : undefined,
            },
          });
        } else {
          // Different vote — switch it
          await tx.postVote.update({
            where: { userId_postId: { userId, postId } },
            data: { vote: voteType },
          });
          await tx.post.update({
            where: { id: postId },
            data: {
              upvoats: voteType === 'UPVOTE' ? { increment: 1 } : { decrement: 1 },
              downvoats: voteType === 'DOWNVOTE' ? { increment: 1 } : { decrement: 1 },
            },
          });
        }
      } else {
        // New vote
        await tx.postVote.create({
          data: { userId, postId, vote: voteType },
        });
        await tx.post.update({
          where: { id: postId },
          data: {
            upvoats: voteType === 'UPVOTE' ? { increment: 1 } : undefined,
            downvoats: voteType === 'DOWNVOTE' ? { increment: 1 } : undefined,
          },
        });
      }
    });

    return { success: true };
  }

  // Helper to map Enum to your Schema field names
  private getFieldName(voteType: VoteEnum): string {
    switch (voteType) {
      case VoteEnum.UPVOTE: return 'upvoats'; // Matches your current schema spelling
      case VoteEnum.DOWNVOTE: return 'downvoats';
      case VoteEnum.NEUTRAL: return 'neutralvoats';
      default: return 'upvoats';
    }
  }

  findAll() {
    return `This action returns all voting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voting`;
  }

  update(id: number, updateVotingDto: UpdateVotingDto) {
    return `This action updates a #${id} voting`;
  }

  remove(id: number) {
    return `This action removes a #${id} voting`;
  }
}
