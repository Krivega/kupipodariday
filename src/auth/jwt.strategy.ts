import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { unauthorizedException } from './exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      /* Указываем, что токен будет передаваться в заголовке Authorization в формате Bearer <token> */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /* Получаем секрет для подписи JWT токенов из конфигурации */
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secretOrKey: configService.get<string>('jwt_secret')!,
    });
  }

  /**
   * Метод validate должен вернуть данные пользователя.
   * В JWT стратегии в качестве параметра метод получает полезную нагрузку из токена.
   * Проверка tokenVersion инвалидирует токены после выхода (signout).
   */
  public async validate(jwtPayload: { sub: number; tokenVersion?: number }) {
    const user = await this.authService.findOneByJwt(jwtPayload);

    if (user === undefined) {
      throw unauthorizedException;
    }

    return user;
  }
}
