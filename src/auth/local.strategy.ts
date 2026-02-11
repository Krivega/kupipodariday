import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';
import { unauthorizedException } from './exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Passport-local передаёт в validate два аргумента: username и password (из тела запроса).
   */
  public async validate(username: string, password: string) {
    const user = await this.authService.findOneByCredentials({
      username,
      password,
    });

    if (user === undefined) {
      throw unauthorizedException;
    }

    return user;
  }
}
