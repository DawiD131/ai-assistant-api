import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth/jwt.guard';
import { EntryQueryDto } from './dto/entry-query.dto';
import { EntryService } from './entry.service';
import { GetUserSettings } from '../decorators/get-user-settings.decorator';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async entry(@Body() query: EntryQueryDto, @GetUserSettings() user: any) {
    return await this.entryService.handleEntryQuery(query, user.openAiApiKey);
  }
}
