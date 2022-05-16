import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createClient } from 'redis';
import * as createRedisStore from 'connect-redis';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const RedisStore = createRedisStore(session);
  const redisClient = createClient({ legacyMode: true, host: 'localhost', port: 6379 });

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
      secret: process.env.SESSION_SECRET,
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

  const config = new DocumentBuilder()
    .setTitle('Share your worry')
    .setDescription('S.Y.W. Api docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap();
