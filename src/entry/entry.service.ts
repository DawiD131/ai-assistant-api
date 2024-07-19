import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { OpenaiService } from '../open-ai/openai.service';
import { EntryQueryDto } from './dto/entry-query.dto';

@Injectable()
export class EntryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly openAiService: OpenaiService,
  ) {}

  async recognizeIntention(dto: EntryQueryDto, apiKey: string) {
    return this.openAiService.createCompletion({
      apiKey,
      messages: [{ role: 'user', content: dto.query }],
      model: 'gpt-4o',
    });
  }
}
