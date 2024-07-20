import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';

interface ConversationPayload {
  name: string | null;
  id: string | undefined;
}

@Injectable()
export class ConversationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async upsert(conversation: ConversationPayload) {
    const { name } = conversation;
    return this.prismaService.conversation.upsert({
      where: { id: conversation.id ?? '' },
      update: {},
      create: {
        name: name,
      },
    });
  }

  async delete(id: string) {
    await this.prismaService.conversation.delete({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    conversation: Partial<Omit<ConversationPayload, 'id'>>,
  ) {
    await this.prismaService.conversation.update({
      where: {
        id,
      },
      data: {
        ...conversation,
      },
    });
  }
}
