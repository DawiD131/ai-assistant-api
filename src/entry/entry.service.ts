import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../open-ai/openai.service';
import { EntryQueryDto } from './dto/entry-query.dto';
import { ConversationRepository } from '../conversation/conversation/conversation.repository';
import { MessageRepository } from '../conversation/message/message.repository';
import { intentionRecognizePrompt } from './prompts/intention-recognize.prompt';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EntryService {
  constructor(
    private readonly openAiService: OpenaiService,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async handleEntryQuery(query: EntryQueryDto, settings: any, userId: string) {
    await this.initializeConversation(query, userId);

    const { content } = await this.recognizeIntention(
      query,
      settings.openAiApiKey,
    );

    if (content === 'action') {
      this.eventEmitter.emit('entry.action', { query, settings });
    } else {
      this.eventEmitter.emit('entry.query', { query, settings });
    }
  }

  async saveAnswer({
    answer,
    conversationId,
  }: {
    answer: string;
    conversationId: string;
  }) {
    await this.messageRepository.save({
      role: 'assistant',
      conversationId: conversationId,
      content: answer,
    });
  }

  private async initializeConversation(query: EntryQueryDto, userId: string) {
    if (!query.conversationId) {
      const { id } = await this.conversationRepository.upsert(
        {
          id: query.conversationId,
          name: null,
        },
        userId,
      );

      query.conversationId = id;
    }

    await this.messageRepository.save({
      role: query.role,
      conversationId: query.conversationId,
      content: query.content,
    });
  }

  private async recognizeIntention(dto: EntryQueryDto, apiKey: string) {
    return await this.openAiService.createCompletion({
      apiKey,
      messages: [
        { role: 'system', content: intentionRecognizePrompt },
        { role: 'user', content: dto.content },
      ],
      model: 'gpt-4o',
    });
  }
}
