import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EntryModule } from './entry/entry.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EntryModule,
  ],
})
export class AppModule {}
