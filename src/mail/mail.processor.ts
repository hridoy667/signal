/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('mail_queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing mail job: ${job.name}`);

    const { email, name, otp } = job.data;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Email Verification Code',
        template: './email-verification',
        context: { name, otp, appName: 'Signal' },
      });
      this.logger.log(`Email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}: ${error.message}`);
      throw error; // Throwing error allows BullMQ to attempt retries
    }
  }
}
