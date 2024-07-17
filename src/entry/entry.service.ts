import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EntryService {
  constructor(private readonly prismaService: PrismaService) {}
}
