import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { PrismaService } from '../services/prisma.service';
import { OpenaiService } from '../open-ai/openai.service';

@Module({
  controllers: [EntryController],
  providers: [EntryService, PrismaService, OpenaiService],
})
export class EntryModule {}
