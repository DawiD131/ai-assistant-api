import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { SaveSettingsDto } from './dto/save-settings.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth/jwt.guard';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async saveSettings(@Body() body: SaveSettingsDto, @UserObj() userObj: User) {
    const { id } = userObj;
    await this.userSettingsService.setSettings(body, id);
  }
}
