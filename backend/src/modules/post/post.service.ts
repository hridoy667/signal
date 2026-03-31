/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import path from 'path';
import * as fs from 'fs';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto, userId: string, image?: Express.Multer.File) {
    if (!userId) throw new BadRequestException('User not authenticated');

    let uploadedImageUrl: string | null = null;

    // Handle Image Upload if a file was sent
    if (image) {
      const fileName = `${Date.now()}-${image.originalname}`;
      const uploadDir = path.join(process.cwd(), 'public', 'posts'); // Use 'posts' folder

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, fileName);
      fs.writeFileSync(uploadPath, image.buffer);

      // We use your helper but point it to the posts directory
      const baseUrl = process.env.BACKEND_URL || 'http://localhost:8000';
      uploadedImageUrl = `${baseUrl}/public/posts/${fileName}`;
    }

    // Final Validation: Need text OR an uploaded image OR existing image URLs
    const hasImages = (createPostDto.imageUrl && createPostDto.imageUrl.length > 0) || uploadedImageUrl;
    if (!createPostDto.content && !hasImages) {
      throw new BadRequestException('Content or an image must be provided');
    }

    // Merge the new uploaded image with any other URLs sent in the DTO
    const finalImages = createPostDto.imageUrl || [];
    if (uploadedImageUrl) finalImages.push(uploadedImageUrl);

    const post = await this.prisma.post.create({
      data: {
        content: createPostDto.content,
        imageUrl: finalImages, // Prisma expects an array if your schema is String[]
        authorId: userId,
      },
    });

    return {
      success: true,
      message: "Post created successfully",
      data: post
    };
  }

  async getRankedSignalFeed(userId: string, userLat: number, userLng: number, limit: number = 20) {
    const posts = await this.prisma.$queryRaw`
    SELECT 
      p.id,
      p.title,
      p.content,
      p."imageUrl",
      p."authorId",
      p."upvoats",
      p."downvoats",
      p."neutralvoats",
      p."createdAt",
      p.latitude,
      p.longitude,

      -- Author info via JOIN
      u.first_name,
      u.last_name,
      u."avatarUrl",

      -- Comment count
      COUNT(DISTINCT c.id)::int AS comment_count,

      -- Current user's vote (UPVOTE | DOWNVOTE | NEUTRAL | null)
      pv.vote AS "userVote",

      -- isLiked derived from vote
      (pv.vote = 'UPVOTE') AS "isLiked",

      -- Ranking 
      (p."upvoats" / POW(EXTRACT(EPOCH FROM (NOW() - p."createdAt")) / 3600 + 2, 1.5)) AS rank_score,

      -- Distance in km via PostGIS
      (ST_Distance(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(${userLng}, ${userLat}), 4326)::geography
      ) / 1000) AS distance_km

    FROM posts p
    LEFT JOIN users u ON u.id = p."authorId"
    LEFT JOIN comments c ON c."postId" = p.id
    LEFT JOIN post_votes pv ON pv."postId" = p.id AND pv."userId" = ${userId}
    WHERE p."createdAt" > NOW() - INTERVAL '7 days'
    GROUP BY p.id, u.id, pv.vote
    ORDER BY rank_score DESC, distance_km ASC
    LIMIT ${limit}
  `;

    return {
      success: true,
      message: "Feed fetched successfully",
      data: posts,
    };
  }

  async findAll(pagination: PaginationDto) {
    const { cursor, limit } = pagination;
    const take = Number(limit);

    const posts = await this.prisma.post.findMany({
      take: take,
      ...(cursor && {
        skip: 1, // Skip the cursor itself
        cursor: { id: cursor },
      }),
      orderBy: {
        createdAt: 'asc', // Or 'desc' depending on your preference
      },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    return {
      success: true,
      message: "Posts retrieved successfully",
      data: posts
    }
  }


  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return {
      success: true,
      message: "Post retrieved successfully",
      data: post,
    };
  }

  async findAllByUser(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: userId,
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
        // Including counts for the UI (like "5 comments")
        _count: {
          select: { comments: true },
        },
      },
      // Order by newest first
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: posts,
    };
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto, image?: Express.Multer.File) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('You can only edit your own posts');

    let uploadedImageUrl: string | null = null;

    if (image) {
      const fileName = `${Date.now()}-${image.originalname}`;
      const uploadDir = path.join(process.cwd(), 'public', 'posts');

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      fs.writeFileSync(path.join(uploadDir, fileName), image.buffer);

      const baseUrl = process.env.BACKEND_URL || 'http://localhost:8000';
      uploadedImageUrl = `${baseUrl}/public/posts/${fileName}`;
    }

    const finalImages = updatePostDto.imageUrl || post.imageUrl || [];
    if (uploadedImageUrl) finalImages.push(uploadedImageUrl);

    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        ...(updatePostDto.content && { content: updatePostDto.content }),
        imageUrl: finalImages,
      },
    });

    return {
      success: true,
      message: "Post updated successfully",
      data: updated,
    };
  }


  // ... inside your Service class

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    // 1. Handle File Deletion
    // Ensure post.imageUrl is treated as an array
    const images = post.imageUrl as string[] | null;

    if (images && Array.isArray(images)) {
      for (const url of images) {
        // Check if the URL belongs to your local storage
        if (url.includes('/public/posts/')) {
          try {
            // Extract filename: handles cases where there might be query params
            const fileName = url.split('/public/posts/')[1].split('?')[0];
            const filePath = path.join(process.cwd(), 'public', 'posts', fileName);

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              // Note: For high traffic, use fs.promises.unlink(filePath)
            }
          } catch (fileErr) {
            console.error(`Failed to delete file: ${url}`, fileErr);
            // We continue so the DB record still gets deleted even if a file is missing
          }
        }
      }
    }

    // 2. Delete from Database
    await this.prisma.post.delete({ where: { id } });

    return {
      success: true,
      message: "Post deleted successfully",
      data: null,
    };
  }
}
