import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from './services/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from './filters/prisma-client-exception-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('FRONTEND_ORIGIN'),
    credentials: true,
  });

  app.use(cookieParser());
  const prismaService = app.get(PrismaService);
  const cacheManager = app.get<Cache>(CACHE_MANAGER);

  app.use((req, res, next) => {
    req.prisma = prismaService;
    req.cacheManager = cacheManager;
    req.configService = configService;
    next();
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(8080);
}
bootstrap();
