import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService], // Exporting MailService to be used in other modules
})
export class MailModule {}
