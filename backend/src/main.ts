/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
// import * as cookieParser from 'cookie-parser';

// You'll need to install: yarn add cookie-parser


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //Global Prefix
  app.setGlobalPrefix('api');

  // Validation: Transforms plain objects to DTO classes and strips extra fields
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips fields not defined in the DTO
      transform: true, // Automatically converts types (e.g., string "1" to number 1)
      forbidNonWhitelisted: true, // Throws error if extra fields are sent
    }),
  );

  const isProduction = process.env.PRODUCTION_MODE === 'true';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    // In production, we strictly allow only our frontend URL
    // In development, we can allow localhost or even '*' if needed
    origin: isProduction ? frontendUrl : [frontendUrl, 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Crucial for sending JWTs in cookies if you switch later
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Cookie Parser: Essential for secure Refresh Tokens later
  // app.use(cookieParser());

  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public',
  });

  // Swagger setup...
  const options = new DocumentBuilder()
    .setTitle(`${process.env.APP_NAME} API`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    useGlobalPrefix: false,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useStaticAssets('public');

  // Default 8000 so Next.js can use 3000; matches frontend getApiBaseUrl() fallback.
  const port = process.env.PORT ?? 8000;
  await app.listen(port);
}
bootstrap();


