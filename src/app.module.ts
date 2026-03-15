import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Add ConfigModule here
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/app.config'; // Your custom config file
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // 1. You MUST load the ConfigModule first
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // This makes it available to RedisModule and others
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
