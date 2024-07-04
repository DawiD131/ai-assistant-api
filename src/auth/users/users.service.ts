import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(payload: CreateUserDto) {
    await this.prisma.user.create({
      data: {
        email: payload.email,
        password: this.hashPassword(payload.password),
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });
  }

  hashPassword(password: string): string {
    return hashSync(password, 8);
  }

  async findOne(email: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
