/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

/**
 * Ответ успешной аутентификации signin: JWT access_token.
 */
export class SigninUserResponseDto {
  @ApiProperty({
    description: 'JWT-токен',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;
}

/**
 * Ответ успешной регистрации signup: профиль пользователя.
 */
export class SignupUserResponseDto {
  @ApiProperty({ example: 5 })
  id!: number;

  @ApiProperty({ example: 'user', minLength: 1, maxLength: 64 })
  username!: string;

  @ApiProperty({
    example: 'Пока ничего не рассказал о себе',
    minLength: 1,
    maxLength: 200,
  })
  about!: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  avatar!: string;

  @ApiProperty({ example: 'user@yandex.ru' })
  email!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: Date;
}
