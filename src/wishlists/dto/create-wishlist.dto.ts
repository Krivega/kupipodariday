import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    description: 'Wishlist name',
    example: 'Мой вишлист',
    minLength: 1,
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name!: string;

  @ApiProperty({
    description: 'Wishlist description, string 0-1500 characters',
    example: 'A list of gifts I would love to receive.',
    maxLength: 1500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1500)
  description?: string;

  @ApiProperty({
    description: 'Wishlist cover image url',
    example: 'https://i.pravatar.cc/150?img=3',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image!: string;

  @ApiProperty({
    description: 'IDs of existing wishes to add to the wishlist',
    type: [Number],
    required: false,
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => {
    return Number;
  })
  itemsId?: number[];
}
