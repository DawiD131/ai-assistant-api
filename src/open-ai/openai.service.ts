import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

interface ChatCompletionParams {
  apiKey: string;
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  model: OpenAI.Chat.ChatModel;
  tools?: any;
}

@Injectable()
export class OpenaiService {
  async createCompletion({
    apiKey,
    messages,
    model,
    tools = null,
  }: ChatCompletionParams) {
    const completion = await this.getInstance(apiKey).chat.completions.create({
      messages: messages,
      model: model,
      tools: tools,
    });

    return completion.choices[0].message;
  }

  private getInstance(apiKey: string) {
    return new OpenAI({ apiKey });
  }
}
