import { UnauthorizedException } from '@nestjs/common';

export const unauthorizedException = new UnauthorizedException(
  'Некорректная пара логин и пароль',
);
