import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { OpenaiService } from '../open-ai/openai.service';
import { EntryQueryDto } from './dto/entry-query.dto';
import { ConversationRepository } from '../conversation/conversation/conversation.repository';
import { MessageRepository } from '../conversation/message/message.repository';

@Injectable()
export class EntryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly openAiService: OpenaiService,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async handleEntryQuery(query: EntryQueryDto, apiKey: string) {
    let conversationId = query.conversationId;
    if (!query.conversationId) {
      const { id } = await this.initializeConversation(query.conversationId);
      conversationId = id;
    }

    await this.messageRepository.save({
      role: query.role,
      conversationId,
      content: query.content,
    });

    return await this.recognizeIntention(query, apiKey);
  }

  private async initializeConversation(conversationId: string | undefined) {
    return await this.conversationRepository.upsert({
      id: conversationId,
      name: null,
    });
  }

  async recognizeIntention(dto: EntryQueryDto, apiKey: string) {
    return this.openAiService.createCompletion({
      apiKey,
      messages: [{ role: 'user', content: dto.content }],
      model: 'gpt-4o',
    });
  }
}
