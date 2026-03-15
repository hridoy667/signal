/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from './helper.util';
import { generateAvatarUrl } from 'src/common/utils/fileUrl.util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAuthDto: CreateAuthDto, image?: Express.Multer.File) {
    if (createAuthDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createAuthDto.email },
      });
      if (existingUser) throw new ConflictException('Email already exists')
    }

    let avatarUrl: string | null = null;
    if (image) {
      const fileName = `${Date.now()}-${image.originalname}`;

      const uploadDir = path.join(process.cwd(), 'public', 'avatars');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const uploadPath = path.join(uploadDir, fileName);
      fs.writeFileSync(uploadPath, image.buffer);
      avatarUrl = generateAvatarUrl(fileName);
    }
    
    const hashedPassword = await hashPassword(createAuthDto.password);

    const newUser = await this.prisma.user.create({
      data: {
        name: createAuthDto.name,
        email: createAuthDto.email,
        password: hashedPassword,
        district: createAuthDto.district,
        // Note: your schema has 'zilla' and 'upazila', 
        // check if 'location' matches your DTO or schema
        zilla: createAuthDto.district, // Assuming 'district' maps to 'zilla'
        avatarUrl: avatarUrl,
      }
    });
    return {
      success: true,
      message: 'User created successfully',
      newUser
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
