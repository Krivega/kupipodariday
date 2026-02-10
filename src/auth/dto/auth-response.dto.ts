/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

/**
 * Ответ успешной аутентификации (signin/signup): JWT access_token.
 */
export class SigninUserResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}

/** Алиас для ответа signup — та же структура. */
export class SignupUserResponseDto extends SigninUserResponseDto {}
