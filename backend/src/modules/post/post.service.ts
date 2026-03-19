/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

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



  findAll() {
    return `This action returns all post`;
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
