import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { SettingsDto } from './dto/settings.dto';
import { createCipheriv } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSettingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async setSettings(settings: SettingsDto, userId: string) {
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

  async getUserSettings(userId: string) {
    return this.prismaService.userSettings.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  private encryptObjectValues(object: any): { [p: string]: string } {
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

    if (object.openAiApiKey) {
      return {
        ...object,
        openAiApiKey: encrypt(object.openAiApiKey),
      };
    }

    return object;
  }
}
