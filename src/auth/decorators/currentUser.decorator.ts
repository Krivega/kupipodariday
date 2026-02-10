import { createParamDecorator } from '@nestjs/common';

import { unauthorizedException } from '../exceptions';

import type { ExecutionContext } from '@nestjs/common';
import type { User } from '@/users/entities/user.entity';

/**
 * Тип пользователя в req.user после аутентификации
 * Исключаем password по соображениям безопасности
 */
export type AuthenticatedUser = Omit<User, 'password'>;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const { user } = request;

    if (!user) {
      throw unauthorizedException;
    }

    return user;
  },
);
