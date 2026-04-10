/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVotingDto } from './dto/create-voting.dto';
import { UpdateVotingDto } from './dto/update-voting.dto';
import { PrismaService } from '../prisma/prisma.service';
// Look for where you import PrismaClient, and add 'vote' (the enum name)
import { vote } from '@prisma/client';

function postCountField(v: vote): 'upvoats' | 'downvoats' | 'neutralvoats' {
  if (v === 'UPVOTE') return 'upvoats';
  if (v === 'DOWNVOTE') return 'downvoats';
  return 'neutralvoats';
}

@Injectable()
export class VotingService {
  constructor(private readonly prisma: PrismaService) {}

  async vote(userId: string, createVotingDto: CreateVotingDto) {
    const { postId, vote: voteType } = createVotingDto;
    await this.prisma.$transaction(async (tx) => {
      const existingVote = await tx.postVote.findUnique({
        where: {
          userId_postId: { userId, postId },
        },
      });

      if (existingVote) {
        if (existingVote.vote === voteType) {
          await tx.postVote.delete({
            where: { userId_postId: { userId, postId } },
          });
          const field = postCountField(voteType);
          await tx.post.update({
            where: { id: postId },
            data: { [field]: { decrement: 1 } },
          });
        } else {
          await tx.postVote.update({
            where: { userId_postId: { userId, postId } },
            data: { vote: voteType },
          });
          const fromField = postCountField(existingVote.vote);
          const toField = postCountField(voteType);
          await tx.post.update({
            where: { id: postId },
            data: {
              [fromField]: { decrement: 1 },
              [toField]: { increment: 1 },
            },
          });
        }
      } else {
        await tx.postVote.create({
          data: { userId, postId, vote: voteType },
        });
        const field = postCountField(voteType);
        await tx.post.update({
          where: { id: postId },
          data: { [field]: { increment: 1 } },
        });
      }
    });

    return { success: true };
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
