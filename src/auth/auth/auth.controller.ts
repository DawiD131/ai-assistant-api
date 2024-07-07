import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../dto/register.dto';
import { UserDto } from '../dto/user.dto';
import { Response, Request } from 'express';
import { RefreshGuard } from './refresh.guard';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res) {
    const user = await this.usersService.register(body);

    await this.authService.setAccessToken(res, user);
    res.json(UserDto.createFrom(user));
    res.end();
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(body);

    await this.authService.setAccessToken(res, user);
    res.json(UserDto.createFrom(user));
    res.end();
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response, @Req() req: Request) {
    await this.authService.clearAccessTokens(res, (req.user as User).id);

    res.json({
      message: 'Logged out',
    });
    res.end();
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    this.authService.tokenIsActive(
      req.cookies['refresh_token'],
      (req.user as User).refreshToken,
    );

    await this.authService.setAccessToken(res, {
      id: (req.user as User).id,
    });

    res.json({
      message: 'Refresh token',
    });
    res.end();
  }
}
