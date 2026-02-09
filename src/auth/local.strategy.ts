import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Passport-local передаёт в validate два аргумента: username и password (из тела запроса).
   */
  public async validate(username: string, password: string) {
    const user = await this.authService.validatePassword({
      username,
      password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    /* Исключаем пароль из результата по соображениям безопасности */
    const { password: passwordRemoved, ...result } = user;

    return result;
  }
}
