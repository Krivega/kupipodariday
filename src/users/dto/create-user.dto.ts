import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username, unique string 2-30 characters',
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
    description: 'About user, string 2-200 characters',
    example: 'Пока ничего не рассказал о себе',
    minLength: 2,
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  about?: string;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://i.pravatar.cc/300',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: 'User email, must be unique',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password, min 6 characters',
    example: 'secret123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
