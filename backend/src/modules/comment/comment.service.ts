import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path to your PrismaService
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCommentDto) {
    console.log(dto);
    console.log('userId:', userId);
    if (!userId) {
      throw new BadRequestException('User ID is required to create a comment');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Create the comment
      const newComment = await tx.comment.create({
        data: {
          content: dto.content,
          postId: dto.postId,
          authorId: userId, // Ensure this is a string, not undefined
          parentId: dto.parentId || null,
        },
        include: {
          author: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Update post count
      await tx.post.update({
        where: { id: dto.postId },
        data: { comment_count: { increment: 1 } },
      });

      return newComment;
    });
  }

  // comment.service.ts
  async getCommentsByPost(postId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          // ← make sure this is here
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return { success: true, data: comments };
  }

  // comment.service.ts
  async delete(userId: string, id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId)
      throw new ForbiddenException('Not your comment');

    await this.prisma.comment.delete({ where: { id } });

    return { success: true, message: 'Comment deleted' };
  }
}
