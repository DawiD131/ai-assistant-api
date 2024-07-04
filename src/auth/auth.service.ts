import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { hashPwd } from './hash';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        password: hashPwd(password),
        email: email,
      },
    });

    if (user && user.password === hashPwd(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        password: hashPwd(loginDto.password),
        email: loginDto.email,
      },
    });

    return {
      access_token: this.jwtService.sign(user.id),
    };
  }
}
