import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from './services/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });

  app.use(cookieParser());
  const prismaService = app.get(PrismaService);
  const cacheManager = app.get<Cache>(CACHE_MANAGER);
  const configService = app.get(ConfigService);

  app.use((req, res, next) => {
    req.prisma = prismaService;
    req.cacheManager = cacheManager;
    req.configService = configService;
    next();
  });

  await app.listen(8080);
}
bootstrap();
