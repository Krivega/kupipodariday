import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @ApiProperty({
    description: 'Wish name, string 1-250 characters',
    example: 'Gift name',
    minLength: 1,
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @ApiProperty({
    description: 'Wish link, string',
    example: 'https://example.com/item',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @ApiProperty({
    description: 'Wish image, string',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'Wish price, number',
    example: 99.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Min(0.01)
  price: number;

  @ApiProperty({
    description: 'Wish description, string 1-1024 characters',
    example: 'Description text',
    minLength: 1,
    maxLength: 1024,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
