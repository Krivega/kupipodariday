import { ApiProperty } from '@nestjs/swagger';

import { OfferResponseDto } from '@/offers/dto/offer-response.dto';
import { UserProfileResponseDto } from '@/users/dto/user-profile-response.dto';

export class WishResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Gift name' })
  name!: string;

  @ApiProperty({ example: 'https://example.com/item' })
  link!: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  image!: string;

  @ApiProperty({ example: 99.99 })
  price!: number;

  @ApiProperty({ example: 0 })
  raised!: number;

  @ApiProperty({ example: 'Description text' })
  description!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: () => UserProfileResponseDto })
  owner!: UserProfileResponseDto;

  @ApiProperty({ type: () => OfferResponseDto, isArray: true })
  offers!: OfferResponseDto[];
}
