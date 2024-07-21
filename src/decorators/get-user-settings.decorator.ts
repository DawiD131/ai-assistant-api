import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Cache } from 'cache-manager';
import { createDecipheriv } from 'crypto';

export const GetUserSettings = createParamDecorator(
  async (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return null;

    const decrypt = (value: string) => {
      if (!value) return null;

      const decipher = createDecipheriv(
        'aes-256-cbc',
        request.configService.get('ENCRYPT_SECRET'),
        request.configService.get('ENCRYPT_INITIAL_VECTOR'),
      );
      let decrypted = decipher.update(value, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    };

    const cache: Cache = request.cacheManager;
    const cacheKey = `user-settings-${user.id}`;

    let settings: Record<string, string> = await cache.get(cacheKey);

    if (!settings) {
      const prisma: PrismaService = request.prisma;

      settings = await prisma.userSettings.findUnique({
        where: {
          userId: user.id,
        },
      });
      await cache.set(cacheKey, settings, 0);
    }
    return { ...user, openAiApiKey: decrypt(settings.openAiApiKey) };
  },
);
