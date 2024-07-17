import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth/jwt.guard';
import { EntryQueryDto } from './dto/entry-query.dto';
import { UserObj } from '../decorators/user-obj.decorator';

@Controller('entry')
export class EntryController {
  @Post()
  @UseGuards(JwtAuthGuard)
  entry(@Body() query: EntryQueryDto, @UserObj() user: any) {
    return user;
  }
}
