import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth/jwt.guard';
import { EntryQueryDto } from './dto/entry-query.dto';
import { EntryService } from './entry.service';
import { GetUserSettings } from '../decorators/get-user-settings.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { OpenaiService } from '../open-ai/openai.service';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('entry')
export class EntryController {
  constructor(
    private readonly entryService: EntryService,
    private readonly eventEmitter: EventEmitter2,
    private readonly openaiService: OpenaiService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async entry(
    @Body() query: EntryQueryDto,
    @GetUserSettings() settings: any,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    await this.openaiService.validateToken(settings.openAiApiKey);

    this.eventEmitter.waitFor('entry.answer').then(async (data) => {
      await this.entryService.saveAnswer({
        conversationId: query.conversationId,
        answer: data[0],
      });

      res.json({
        answer: data[0],
        conversationId: query.conversationId,
      });
      res.end();
    });

    await this.entryService.handleEntryQuery(query, settings, user.id);
  }
}
