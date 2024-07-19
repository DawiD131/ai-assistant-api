import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { MessageRepository } from './message/message.repository';

@Module({
  providers: [PrismaService, MessageRepository],
})
export class ConversationModule {}
