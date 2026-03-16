/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service'; // Ensure this path is correct

@Injectable()
export class UcodeRepository {
  // Inject your existing PrismaService instead of "new PrismaClient()"
  constructor(private readonly prisma: PrismaService) {}

  async createOtp(email: string, userId?: string) {
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    const token = String(Math.floor(100000 + Math.random() * 900000));

    try {
      // Use the instance property: this.prisma
      await this.prisma.verificationToken.create({
        data: {
          token,
          expiresAt,
          email,
          userId: userId ?? undefined,
        },
      });
      return token;
    } catch (error) {
      console.error('Prisma Error:', error);
      throw error;
    }
  }

  async verifyOtp(email: string, userOtp: string): Promise<boolean> {
    const record = await this.prisma.verificationToken.findFirst({
      where: { email, token: userOtp },
      orderBy: { expiresAt: 'desc' },
    });

    if (!record) throw new Error('Invalid verification code');

    if (new Date() > record.expiresAt) {
      await this.prisma.verificationToken.delete({ where: { id: record.id } });
      throw new Error('Verification code has expired');
    }

    await this.prisma.verificationToken.delete({ where: { id: record.id } });
    return true;
  }
}