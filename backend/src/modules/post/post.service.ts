/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
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

  async getRankedSignalFeed(userLat: number, userLng: number, limit: number = 20) {
  return this.prisma.$queryRaw`
    SELECT 
      id, title, content, "imageUrl", "authorId", "likeCount", "createdAt", latitude, longitude,
      -- 1. Calculate the Popularity/Recency Score (The Signal)
      ("likeCount" / POW(EXTRACT(EPOCH FROM (NOW() - "createdAt")) / 3600 + 2, 1.5)) as rank_score,
      
      -- 2. Calculate Distance in Kilometers using PostGIS
      -- ST_Distance returns meters by default with 4326, so we divide by 1000
      (ST_Distance(location, ST_SetSRID(ST_MakePoint(${userLng}, ${userLat}), 4326), true) / 1000) as distance_km
    FROM "posts"
    WHERE "createdAt" > NOW() - INTERVAL '7 days' -- Filter to last week for performance
    ORDER BY rank_score DESC, distance_km ASC
    LIMIT ${limit};
  `;
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
      select:{
        id: true,
        content: true,
        imageUrl: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }


  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
