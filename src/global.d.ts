/// <reference types="jest" />

import type { User } from './users/entities/user.entity';

/**
 * Тип пользователя в req.user после аутентификации
 * Исключаем password по соображениям безопасности
 */
export type AuthenticatedUser = Omit<User, 'password'>;

declare global {
  interface Request {
    user?: AuthenticatedUser;
  }
}
