import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';

export class UserDto {
  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Exclude()
  refreshToken: string;

  static createFrom(user: Partial<User>) {
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
