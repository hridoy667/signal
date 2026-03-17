import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { UcodeRepository } from 'src/common/ucode/ucode.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    JwtModule.register({
      global: true, // This makes it available everywhere
      secret: process.env.JWT_SECRET || 'your-fallback-secret', // Use your .env variable
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UcodeRepository],
})
export class AuthModule {}
