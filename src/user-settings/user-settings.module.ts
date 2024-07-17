import { Module } from '@nestjs/common';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserSettingsController],
  providers: [UserSettingsService, PrismaService],
})
export class UserSettingsModule {}
