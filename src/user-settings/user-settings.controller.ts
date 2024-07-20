import { Body, Controller, Inject, Put, UseGuards } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { SaveSettingsDto } from './dto/save-settings.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth/jwt.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('user-settings')
export class UserSettingsController {
  constructor(
    private readonly userSettingsService: UserSettingsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async saveSettings(@Body() body: SaveSettingsDto, @GetUser() user: User) {
    const { id } = user;

    await this.cacheManager.del(`user-settings-${id}`);
    await this.userSettingsService.setSettings(body, id);
  }
}