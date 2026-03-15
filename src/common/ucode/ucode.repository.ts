/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
// Important: Import PrismaClient from your CUSTOM path as defined in your generator
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();

export class UcodeRepository {

    static async createOtp(email: string, userId?: string) {
        const otpExpiryTime = 2 * 60 * 1000; // 2 minutes
        const expiresAt = new Date(Date.now() + otpExpiryTime);

        const token = String(Math.floor(100000 + Math.random() * 900000));
        
        try {
            await prisma.verificationToken.create({
                data: {
                    token,
                    expiresAt,
                    email,
                    userId: userId ?? undefined 
                }
            });
            return token;
        } catch (error) {
            console.error("Prisma Error:", error);
            throw error;
        }
    }



    static async verifyOtp(email: string, userOtp: string): Promise<boolean> {
    //Find the most recent token for this email
    const record = await prisma.verificationToken.findFirst({
      where: { 
        email: email,
        token: userOtp 
      },
      orderBy: { expiresAt: 'desc' },
    });

    if (!record) {
      throw new Error('Invalid verification code');
    }

    // 3. Check if it has expired
    const isExpired = new Date() > record.expiresAt;
    if (isExpired) {
      await prisma.verificationToken.delete({ where: { id: record.id } });
      throw new Error('Verification code has expired');
    }

    // Delete the token
    await prisma.verificationToken.delete({ where: { id: record.id } });
    
    return true;
  }
}
