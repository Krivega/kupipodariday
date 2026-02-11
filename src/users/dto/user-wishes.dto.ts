import { ApiProperty } from '@nestjs/swagger';

import { OfferResponseDto } from '@/offers/dto/offer-response.dto';

export class UserWishesDto {
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

  @ApiProperty({ example: 99.99 })
  price!: number;

  @ApiProperty({ example: 0 })
  raised!: number;

  @ApiProperty({ example: 0 })
  copied!: number;

  @ApiProperty({ example: 'Description text', minLength: 1, maxLength: 1024 })
  description!: string;

  @ApiProperty({
    type: () => {
      return OfferResponseDto;
    },
    isArray: true,
  })
  offers!: OfferResponseDto[];
}
