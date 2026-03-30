/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { verifyDto } from './dto/verify-email.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { resendOtpDto } from './dto/resend-otp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (Waiting Room)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'OTP sent to email.' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 8 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() registerDto: RegisterDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.authService.create(registerDto, image);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify OTP and create permanent account' })
  verify(@Body() verifydto: verifyDto) {
    return this.authService.verifyEmail(verifydto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to email' })
  resendOtp(@Body() resendOtpdto: resendOtpDto) {
    return this.authService.resendOtp(resendOtpdto.email);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  login(@Body() logindto: LoginDto) {
    return this.authService.login(logindto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    const userId = req.user.userId;
    return this.authService.getMe(userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }
}
