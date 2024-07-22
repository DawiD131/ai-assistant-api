import { Module } from '@nestjs/common';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { PrismaService } from '../services/prisma.service';
import { OpenaiService } from '../open-ai/openai.service';
import { MessageRepository } from '../conversation/message/message.repository';
import { ConversationRepository } from '../conversation/conversation/conversation.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitter2],
  controllers: [EntryController],
  providers: [
    EntryService,
    PrismaService,
    OpenaiService,
    MessageRepository,
    ConversationRepository,
  ],
})
export class EntryModule {}
