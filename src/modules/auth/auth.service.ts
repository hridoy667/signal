/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { comparePassword, hashPassword } from './helper.util';
import { generateAvatarUrl } from 'src/common/utils/fileUrl.util';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { MailService } from 'src/mail/mail.service';
import { Redis } from 'ioredis';
import { UcodeRepository } from 'src/common/ucode/ucode.repository';
import { verifyDto } from './dto/verify-email.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
    private readonly ucodeRepository: UcodeRepository,
    private jwtService: JwtService,
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


  async verifyEmail(verifydto: verifyDto) {
    try {
      // 1. Verify OTP
      const isValid = await this.ucodeRepository.verifyOtp(verifydto.email, verifydto.otp);

      if (!isValid) {
        throw new BadRequestException('Invalid or expired OTP');
      }

      // 2. Get temp data from Redis
      const tempUserDataStr = await this.redis.get(`temp_user:${verifydto.email}`);
      if (!tempUserDataStr) {
        throw new ConflictException('Session expired. Please register again.');
      }

      const tempUserData = JSON.parse(tempUserDataStr);

      // 3. Create user in DB
      const newUser = await this.prisma.user.create({
        data: {
          email: tempUserData.email,
          first_name: tempUserData.first_name,
          last_name: tempUserData.last_name,
          password: tempUserData.password,
          avatarUrl: tempUserData.avatarUrl,
          // Add other fields like district/gender if they are in your RegisterDto
          district: tempUserData.district,
          gender: tempUserData.gender,
        },
      });

      // 4. CLEANUP: Remove data from Redis so it can't be used again
      await this.redis.del(`temp_user:${verifydto.email}`);

      // 5. RETURN success
      return {
        success: true,
        message: 'Email verified successfully. Account created.',
        user: {
          id: newUser.id,
          email: newUser.email
        }
      };

    } catch (error) {
      // Rethrow if it's already a NestJS exception, otherwise wrap it
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }


  async resendOtp(email) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new ConflictException('Email already verified. Please login.');

    //Get temp data from Redis
    const tempUserDataStr = await this.redis.get(`temp_user:${email}`);
    if (!tempUserDataStr) {
      throw new ConflictException('Session expired. Please register again.');
    }

    const tempUserData = JSON.parse(tempUserDataStr);
    const otp = await this.ucodeRepository.createOtp(email);

    await this.mailService.sendOtpCodeToEmail({
      email,
      name: tempUserData.first_name,
      otp,
    });
    return {
      success: true,
      message: 'New OTP sent to your email.'
    }
  }


  async login(logindto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: logindto.email,
      }
    })
    if (!user) throw new BadRequestException('Invalid credentials');
    
    //compare passwords
    const isPasswordValid = await comparePassword(logindto.password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const payload = { email: user.email, sub: user.id, district: user.district };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '5h' });
    return {
      success: true,
      message: 'Login successful',
      accessToken
    }
  }
}
