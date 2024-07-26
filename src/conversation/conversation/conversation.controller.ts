import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/auth/jwt.guard';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@GetUser() user: User) {
    return await this.conversationRepository.getAllByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    return await this.conversationRepository.getById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return await this.conversationRepository.delete(id);
  }
}
