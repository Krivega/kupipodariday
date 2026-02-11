import { ApiProperty } from '@nestjs/swagger';

/**
 * Wish without owner and offers - used as item in WishlistResponseDto.
 */
export class WishPartialDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ example: 'Gift name', minLength: 1, maxLength: 250 })
  name!: string;

  @ApiProperty({ example: 'https://example.com/item' })
  link!: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  image!: string;

  @ApiProperty({ example: 99.99, minimum: 1 })
  price!: number;

  @ApiProperty({ example: 0, minimum: 1 })
  raised!: number;

  @ApiProperty({ example: 0 })
  copied!: number;

  @ApiProperty({ example: 'Description text', minLength: 1, maxLength: 1024 })
  description!: string;
}
