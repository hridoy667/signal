import { PartialType } from '@nestjs/swagger';
import { CreateConversationDto } from './create-conversation.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateConversationDto extends PartialType(CreateConversationDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deleted_photos?: string[];
}
