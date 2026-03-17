import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(
    // Inject the queue we registered in the module
    @InjectQueue('mail_queue') private readonly mailQueue: Queue,
  ) {}

  async sendOtpCodeToEmail(data: { email: string; name: string; otp: string }) {
    try {
      // Add the job to the queue
      await this.mailQueue.add(
        'sendOtp', // Job name
        {
          ...data,
          appName: process.env.APP_NAME || 'Signal Clone',
        },
        {
          attempts: 3, // If SMTP fails, try 3 times
          backoff: {
            type: 'exponential',
            delay: 5000, // Wait 5s, then 10s, etc.
          },
          removeOnComplete: true, // Clean up Redis after success
        },
      );

      return { success: true };
    } catch (error) {
      console.error('Error adding mail to queue:', error);
      throw new InternalServerErrorException(
        'Could not queue the verification email',
      );
    }
  }
}
