import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { hashSync } from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOne({ email });

    if (!user) throw new UnauthorizedException();

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException();

    return user;
  }

  generateTokens(payload: {
    id: string;
  }): [accessToken: string, refreshToken: string] {
    const accessToken = this.jwtService.sign({ user_id: payload.id });
    const refreshToken = this.jwtService.sign(
      { user_id: payload.id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      },
    );

    return [accessToken, refreshToken];
  }

  async setAccessToken(res, payload: { id: string }): Promise<void> {
    const [token, refreshToken] = this.generateTokens(payload);

    await this.usersService.update(payload.id, {
      refreshToken: hashSync(refreshToken, 8),
    });

    res
      .cookie('access_token', token, {
        httpOnly: true,
        domain: this.configService.get('DOMAIN'),
        expiresIn: new Date(
          Date.now() + this.configService.get('JWT_EXPIRES_IN') * 1000,
        ),
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        domain: this.configService.get('DOMAIN'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') * 1000,
      });
  }

  async clearAccessTokens(res: Response, id: string) {
    await this.usersService.update(id, {
      refreshToken: null,
    });

    res
      .clearCookie('access_token', {
        httpOnly: true,
        domain: this.configService.get('DOMAIN'),
      })
      .clearCookie('refresh_token', {
        httpOnly: true,
        domain: this.configService.get('DOMAIN'),
      });
  }

  async validateUser(id: string) {
    return this.usersService.findOne({ id });
  }

  tokenIsActive(token: string, hash: string) {
    const tokenIsActive = compare(token, hash || '');

    if (!tokenIsActive) throw new ForbiddenException();

    return true;
  }
}
