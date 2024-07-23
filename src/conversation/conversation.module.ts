import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { MessageRepository } from './message/message.repository';
import { ConversationController } from './conversation/conversation.controller';
import { ConversationRepository } from './conversation/conversation.repository';

@Module({
  providers: [PrismaService, MessageRepository, ConversationRepository],
  controllers: [ConversationController],
})
export class ConversationModule {}
