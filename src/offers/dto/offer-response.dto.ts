import { ApiProperty } from '@nestjs/swagger';

import { UserProfileResponseDto } from '@/users/dto/user-profile-response.dto';
import { WishPartialDto } from '@/wishes/dto/wish-partial.dto';

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
    description: 'Wish item (partial, without owner/offers)',
    type: () => {
      return WishPartialDto;
    },
  })
  item!: WishPartialDto;

  @ApiProperty({
    type: () => {
      return UserProfileResponseDto;
    },
  })
  user!: UserProfileResponseDto;
}
