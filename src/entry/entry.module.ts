import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { PrismaService } from '../services/prisma.service';
import { OpenaiService } from '../open-ai/openai.service';
import { MessageRepository } from '../conversation/message/message.repository';
import { ConversationRepository } from '../conversation/conversation/conversation.repository';
import { ActionProcessorModule } from '../action-processor/action-processor.module';
import { ActionProcessorService } from '../action-processor/action-processor.service';

@Module({
  controllers: [EntryController],
  providers: [
    EntryService,
    PrismaService,
    OpenaiService,
    MessageRepository,
    ConversationRepository,
    ActionProcessorService,
  ],
})
export class EntryModule {}
