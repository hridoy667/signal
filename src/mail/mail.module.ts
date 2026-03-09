import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('mail.host'),
          port: config.get('mail.port'),
          secure: config.get('mail.port') === 465, // true for 465, false for 587
          auth: {
            user: config.get('mail.user'),
            pass: config.get('mail.password'),
          },
        },
        defaults: {
          from: `"${config.get('app.name')}" <${config.get('mail.from')}>`,
        },
        template: {
          // This looks for .hbs files in your project root /templates folder
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
