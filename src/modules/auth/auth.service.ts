/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from './helper.util';
import { generateAvatarUrl } from 'src/common/utils/fileUrl.util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async create(registerDto: RegisterDto, image?: Express.Multer.File) {
    if (registerDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
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
    
    const hashedPassword = await hashPassword(registerDto.password);

    //store everything in redis and set an expiry of 15 mins

    

    const newUser = await this.prisma.user.create({
      data: {
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        email: registerDto.email,
        password: hashedPassword,
        district: registerDto.district,
        // check if 'location' matches your DTO or schema
        gender:registerDto.gender,
        avatarUrl: avatarUrl,
      }
    });
    return {
      success: true,
      message: 'User created successfully',
      newUser
    }
  }

  async login(loginDto){
    const user=await this.prisma.user.findFirst({
      where:{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email:loginDto.email
      }
    })

    if(!user){
      return{
        success:false,
        message:'Invalid email or password'
      }
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
