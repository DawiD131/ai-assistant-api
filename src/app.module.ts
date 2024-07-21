import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EntryModule } from './entry/entry.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { CacheModule } from '@nestjs/cache-manager';
import { OpenaiService } from './open-ai/openai.service';
import { ConversationModule } from './conversation/conversation.module';
import { ActionProcessorModule } from './action-processor/action-processor.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    EntryModule,
    UserSettingsModule,
    CacheModule.register(),
    ConversationModule,
    ActionProcessorModule,
  ],
  providers: [OpenaiService],
})
export class AppModule {}
