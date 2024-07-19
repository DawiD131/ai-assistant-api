import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

interface ChatCompletionParams {
  apiKey: string;
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  model: OpenAI.Chat.ChatModel;
}

@Injectable()
export class OpenaiService {
  async createCompletion({ apiKey, messages, model }: ChatCompletionParams) {
    const completion = await this.getInstance(apiKey).chat.completions.create({
      messages: messages,
      model: model,
    });

    return completion.choices[0].message;
  }

  private getInstance(apiKey: string) {
    return new OpenAI({ apiKey });
  }
}
