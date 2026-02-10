import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindUserDto {
  @ApiProperty({
    description: 'User username, email or about',
    example: 'some@ya.ru',
  })
  @IsString()
  @IsNotEmpty()
  query!: string;
}
