/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq'; // Import BullModule
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor'; // We will create this next
import { join } from 'path';

@Module({
  imports: [
    // 1. Register the queue for this specific module
    BullModule.registerQueue({
      name: 'mail_queue',
    }),

    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('mail.host'),
          port: config.get('mail.port'),
          secure: config.get('mail.port') === 465,
          auth: {
            user: config.get('mail.user'),
            pass: config.get('mail.password'),
          },
        },
        defaults: {
          from: `"${config.get('app.name')}" <${config.get('mail.from')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  // 2. Add MailProcessor to providers so it can run in the background
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
