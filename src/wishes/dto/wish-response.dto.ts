import { ApiProperty } from '@nestjs/swagger';

import { OfferResponseDto } from '@/offers/dto/offer-response.dto';
import { UserPublicProfileResponseDto } from '@/users/dto/user-public-profile-response.dto';

export class WishResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Gift name' })
  name!: string;

  @ApiProperty({ example: 'https://example.com/item' })
  link!: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  image!: string;

  @ApiProperty({ example: 99.99, minimum: 1 })
  price!: number;

  @ApiProperty({ example: 0, minimum: 0 })
  raised!: number;

  @ApiProperty({ example: 0 })
  copied!: number;

  @ApiProperty({ example: 'Description text' })
  description!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({
    type: () => {
      return UserPublicProfileResponseDto;
    },
  })
  owner!: UserPublicProfileResponseDto;

  @ApiProperty({
    type: () => {
      return OfferResponseDto;
    },
    isArray: true,
  })
  offers!: OfferResponseDto[];
}
