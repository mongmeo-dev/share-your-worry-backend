import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createClient } from 'redis';
import * as createRedisStore from 'connect-redis';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import * as AWS from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    legacyMode: true,
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  });

  redisClient.on('error', (err) => {
    new Logger('REDIS').error('Could not establish a connection with redis. ' + err);
  });
  redisClient.on('connect', () => {
    new Logger('REDIS').log('Connected to redis successfully');
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 2629800000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Share your worry')
    .setDescription('S.Y.W. Api docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  AWS.config.credentials = {
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_ACCESS_KEY_SECRET'),
  };

  await app.listen(3000);
}

bootstrap();
