import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      /* Указываем, что токен будет передаваться в заголовке Authorization в формате Bearer <token> */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /* Получаем секрет для подписи JWT токенов из конфигурации */
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secretOrKey: this.configService.get<string>('jwt_secret')!,
    });
  }

  /**
   * Метод validate должен вернуть данные пользователя
   * В JWT стратегии в качестве параметра метод получает полезную нагрузку из токена
   */
  public async validate(_jwtPayload: { sub: number }) {
    /* В subject токена будем передавать идентификатор пользователя */
    const user = await this.usersService.findOne({ id: _jwtPayload.sub });

    if (user === null) {
      throw new UnauthorizedException();
    }

    /* Исключаем пароль из результата по соображениям безопасности */
    const { password, ...result } = user;

    return result;
  }
}
