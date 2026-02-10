import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO для тела запроса POST /signin.
 * Passport local strategy ожидает поля username и password.
 */
export class SigninUserDto {
  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @ApiProperty({
    description: 'Password',
    example: 'secret123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
