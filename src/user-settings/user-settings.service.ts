import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SaveSettingsDto } from './dto/save-settings.dto';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSettingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async setSettings(settings: SaveSettingsDto, userId: string) {
    await this.prismaService.userSettings.upsert({
      where: {
        userId: userId,
      },
      update: this.encryptObjectValues(settings),
      create: {
        ...this.encryptObjectValues(settings),
        userId: userId,
      },
    });
  }

  private encryptObjectValues(object: unknown): { [p: string]: string } {
    const hmac = createHmac('sha512', this.configService.get('ENCRYPT_SECRET'));

    const encrypt = (value: string) => {
      hmac.update(value);
      return hmac.digest('hex');
    };

    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => [key, encrypt(value)]),
    );
  }
}
