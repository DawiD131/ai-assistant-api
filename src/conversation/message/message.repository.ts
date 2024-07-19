import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { SaveMessageDto } from './dto/save-message.dto';

@Injectable()
export class MessageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(message: SaveMessageDto) {
    await this.prismaService.message.create({
      data: {
        role: message.role,
        content: message.content,
      },
    });
  }
}
