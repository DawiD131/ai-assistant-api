import { Module } from '@nestjs/common';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';
import { PrismaService } from '../services/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [UserSettingsController],
  providers: [UserSettingsService, PrismaService],
})
export class UserSettingsModule {}
