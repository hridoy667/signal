import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Add ConfigModule here
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/app.config'; // Your custom config file
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostModule } from './modules/post/post.module';
import { ChatModule } from './modules/chat/chat.module';
import { VotingModule } from './modules/voting/voting.module';
import { CommentModule } from './modules/comment/comment.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { DistrictsModule } from './modules/districts/districts.module';

@Module({
  imports: [
    // 1. You MUST load the ConfigModule first
    AuthModule,
    DistrictsModule,
    UsersModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // This makes it available to RedisModule and others
    }),
    //bullmq
    // 1. Fix: Use forRootAsync for BullMQ
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('redis.host'),
          port: +config.get('redis.port'),
          password: config.get('redis.password'),
        },
      }),
    }),

    // Register the specific mail queue
    BullModule.registerQueue({
      name: 'mail_queue',
    }),
    // 2. Now Redis can safely inject the ConfigService
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: `redis://${config.get('redis.host')}:${config.get('redis.port')}`,
        options: {
          password: config.get('redis.password'),
        },
      }),
    }),
    PostModule,
    ChatModule,
    VotingModule,
    CommentModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
