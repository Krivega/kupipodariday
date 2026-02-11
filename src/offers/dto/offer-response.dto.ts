import { ApiProperty } from '@nestjs/swagger';

import { UserProfileResponseDto } from '@/users/dto/user-profile-response.dto';
import { WishResponseDto } from '@/wishes/dto/wish-response.dto';

export class OfferResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ example: 50.5 })
  amount!: number;

  @ApiProperty({ example: false })
  hidden!: boolean;

  @ApiProperty({
    description: 'Wish item',
    type: () => {
      return WishResponseDto;
    },
  })
  item!: WishResponseDto;

  @ApiProperty({
    type: () => {
      return UserProfileResponseDto;
    },
  })
  user!: UserProfileResponseDto;
}
