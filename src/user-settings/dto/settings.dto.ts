import { Exclude, Expose, plainToInstance } from 'class-transformer';

export class SettingsDto {
  @Exclude()
  openAiApiKey?: string;

  @Expose()
  todoListWebhook?: string;

  static createFrom(settings: Partial<SettingsDto>) {
    return plainToInstance(SettingsDto, settings, {
      excludeExtraneousValues: true,
    });
  }
}
