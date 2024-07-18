import { Body, Controller, Inject, Put, UseGuards } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { SaveSettingsDto } from './dto/save-settings.dto';
import { UserObj } from '../decorators/user-obj.decorator';
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
  async saveSettings(@Body() body: SaveSettingsDto, @UserObj() userObj: User) {
    const { id } = userObj;

    await this.cacheManager.del(`user-settings-${id}`);
    await this.userSettingsService.setSettings(body, id);
  }
}
