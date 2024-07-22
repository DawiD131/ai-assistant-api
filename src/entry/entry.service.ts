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

  async handleEntryQuery(query: EntryQueryDto, apiKey: string) {
    await this.initializeConversation(query);

    const { content } = await this.recognizeIntention(query, apiKey);

    if (content === 'action') {
      this.eventEmitter.emit('entry.action', { query, apiKey });
    } else {
      this.eventEmitter.emit('entry.query', { query, apiKey });
    }
  }

  private async initializeConversation(query: EntryQueryDto) {
    if (!query.conversationId) {
      const { id } = await this.conversationRepository.upsert({
        id: query.conversationId,
        name: null,
      });

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
