/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { InjectRedis } from '@nestjs-modules/ioredis';
import { MailService } from 'src/mail/mail.service';
import { Redis } from 'ioredis';
import { UcodeRepository } from 'src/common/ucode/ucode.repository';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
    private readonly ucodeRepository: UcodeRepository,
  private readonly mailService: MailService,
    @InjectRedis() private readonly redis: Redis,  
  ) { }

  async create(registerDto: RegisterDto, image?: Express.Multer.File) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) throw new ConflictException('Email already exists');

    // Handle Image Upload
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

    //Hash Password
    const hashedPassword = await hashPassword(registerDto.password);

    //Store in Redis for 15 minutes 
    const tempUserData = {
      ...registerDto,
      password: hashedPassword,
      avatarUrl,
    };

    await this.redis.set(
      `temp_user:${registerDto.email}`,
      JSON.stringify(tempUserData),
      'EX',
      900,
    );

    // 5. Generate OTP and store in DB via your Repository
    const otp = await this.ucodeRepository.createOtp(registerDto.email);

    // 6. Send OTP via BullMQ Mail Queue
    await this.mailService.sendOtpCodeToEmail({
      email: registerDto.email,
      name: registerDto.first_name,
      otp: otp,
    });

    return {
      success: true,
      message: 'Verification code sent to your email. Please verify to complete registration.',
    };
  }

  async verifyEmail(email: string, otp: string) {
    try {
      //verify otp
      const isValid=await this.ucodeRepository.verifyOtp(email, otp);
      if(isValid){

        //Get temp data from Redis
        const tempUserDataStr = await this.redis.get(`temp_user:${email}`);
        if (!tempUserDataStr) {
          throw new ConflictException('Session Expaired. Please register again.');
        }
        const tempUserData = JSON.parse(tempUserDataStr);

        //Create user in DB
        await this.prisma.user.create({
          data: {
            email: tempUserData.email,
            first_name: tempUserData.first_name,
            last_name: tempUserData.last_name,
            password: tempUserData.password,
            avatarUrl: tempUserData.avatarUrl,
          },
        });
      }
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async login(loginDto){
    const user=await this.prisma.user.findFirst({
      where:{
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
