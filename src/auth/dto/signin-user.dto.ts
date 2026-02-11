import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO для тела запроса POST /signin.
 * Passport local strategy ожидает поля username и password.
 */
export class SigninUserDto {
  @ApiProperty({
    description: 'Username',
    example: 'exampleuser',
    minLength: 1,
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  username!: string;

  @ApiProperty({
    description: 'Password',
    example: 'somestrongpassword',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  password!: string;
}
