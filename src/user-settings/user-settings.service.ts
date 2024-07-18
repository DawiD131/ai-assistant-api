import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SaveSettingsDto } from './dto/save-settings.dto';
import { createCipheriv } from 'crypto';
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
    const encrypt = (value: string) => {
      const cipher = createCipheriv(
        'aes-256-cbc',
        this.configService.get('ENCRYPT_SECRET'),
        this.configService.get('ENCRYPT_INITIAL_VECTOR'),
      );
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    };

    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => [key, encrypt(value)]),
    );
  }
}
