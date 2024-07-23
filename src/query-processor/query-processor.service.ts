import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OpenaiService } from '../open-ai/openai.service';

@Injectable()
export class QueryProcessorService {
  constructor(
    private readonly openAiService: OpenaiService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('entry.query')
  async selectTool(payload: any) {
    const { content } = await this.openAiService.createCompletion({
      apiKey: payload.apiKey,
      messages: [{ role: 'user', content: payload.query.content }],
      model: 'gpt-4o',
    });

    this.eventEmitter.emit('entry.answer', content);
  }
}
