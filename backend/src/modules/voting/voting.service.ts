/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVotingDto } from './dto/create-voting.dto';
import { UpdateVotingDto } from './dto/update-voting.dto';
import { PrismaService } from '../prisma/prisma.service';
// Look for where you import PrismaClient, and add 'vote' (the enum name)
import { PrismaClient, vote as VoteEnum } from '@prisma/client';
@Injectable()
export class VotingService {


  constructor(private readonly prisma: PrismaService) { }

async vote(createVotingDto: CreateVotingDto, userId: string) {
    const { postId, vote } = createVotingDto;
    const newVoteType = vote as VoteEnum;

    // 1. Check if post exists
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    // 2. Find existing vote
    const existingVote = await this.prisma.postVote.findFirst({
      where: { userId, postId },
    });

    return await this.prisma.$transaction(async (tx) => {
      // --- SCENARIO A: REMOVE VOTE (User clicks the same button) ---
      if (existingVote && existingVote.vote === newVoteType) {
        await tx.postVote.delete({ where: { id: existingVote.id } });

        await tx.post.update({
          where: { id: postId },
          data: { [this.getFieldName(newVoteType)]: { decrement: 1 } },
        });

        return { success: true, message: 'Vote removed' };
      }

      // --- SCENARIO B: UPDATE VOTE (User switches reaction) ---
      if (existingVote) {
        const oldVoteType = existingVote.vote;
        await tx.postVote.update({
          where: { id: existingVote.id },
          data: { vote: newVoteType },
        });

        await tx.post.update({
          where: { id: postId },
          data: {
            [this.getFieldName(oldVoteType)]: { decrement: 1 },
            [this.getFieldName(newVoteType)]: { increment: 1 },
          },
        });

        return { success: true, message: 'Vote updated' };
      }

      // --- SCENARIO C: NEW VOTE ---
      await tx.postVote.create({
        data: { userId, postId, vote: newVoteType },
      });

      await tx.post.update({
        where: { id: postId },
        data: { [this.getFieldName(newVoteType)]: { increment: 1 } },
      });

      return { success: true, message: 'Vote recorded' };
    });
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
