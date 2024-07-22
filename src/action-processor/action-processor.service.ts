import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OpenaiService } from '../open-ai/openai.service';
import { toolsSchema } from './prompts/tools-schema.prompt';
import { ToolsApi } from './ToolsApi';

@Injectable()
export class ActionProcessorService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly openAiService: OpenaiService,
  ) {}

  @OnEvent('entry.action')
  async selectTool(payload: any) {
    const resp = await this.openAiService.createCompletion({
      apiKey: payload.apiKey,
      messages: [{ role: 'user', content: payload.query.content }],
      tools: toolsSchema,
      model: 'gpt-4o',
    });

    const fn = resp.tool_calls[0].function;

    await ToolsApi.saveTodo(JSON.parse(fn.arguments) as any);

    const resp2 = await this.openAiService.createCompletion({
      apiKey: payload.apiKey,
      messages: [
        {
          role: 'system',
          content: `Summarize taken action briefely
         examples ###
          input: create shopping list
          output: Sure! Shopping list was created

          input: Add event to calendar
          output: Of course! Event added to your calendar
         ###
        `,
        },
        { role: 'user', content: payload.query.content },
      ],
      model: 'gpt-4o',
    });

    this.eventEmitter.emit('entry.answer', resp2.content);
  }
}
