import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    description: 'Wishlist name, string 1-250 characters',
    example: 'My birthday wishlist',
    minLength: 1,
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @ApiProperty({
    description: 'Wishlist description, string 1-1500 characters',
    example: 'A list of gifts I would love to receive.',
    minLength: 1,
    maxLength: 1500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1500)
  description: string;

  @ApiProperty({
    description: 'Wishlist cover image url, string',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;
}
