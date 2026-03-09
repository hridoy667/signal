import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  // The missing function for OTP
  async sendOtpCodeToEmail({
    name,
    email,
    otp,
  }: {
    name: string;
    email: string;
    otp: string;
  }) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const appName = this.config.get('app.name');
      const from = `${appName} <${this.config.get('mail.from')}>`;

      await this.mailerService.sendMail({
        to: email,
        from,
        subject: 'Email Verification Code',
        template: './email-verification', // This points to email-verification.hbs
        context: {
          name,
          otp,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          appName,
        },
      });

      this.logger.log(`OTP sent successfully to ${email}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to send OTP to ${email}: ${error.message}`);
    }
  }
}
