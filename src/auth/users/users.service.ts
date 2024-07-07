import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { hashSync } from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  register(payload: RegisterDto) {
    return this.prisma.user.create({
      data: {
        email: payload.email,
        password: this.hashPassword(payload.password),
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });
  }

  update(userId: string, data: Partial<UpdateUserDto>) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }

  async findOne(where: any): Promise<User> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  hashPassword(password: string): string {
    return hashSync(password, 8);
  }
}
