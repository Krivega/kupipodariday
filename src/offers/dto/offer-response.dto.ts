import { ApiProperty } from '@nestjs/swagger';

import type { UserProfileResponseDto } from '@/users/dto/user-profile-response.dto';
import type { Wish } from '@/wishes/entities/wish.entity';

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

  @ApiProperty({ description: 'Wish item' })
  item!: Wish;

  @ApiProperty({ required: false })
  user?: UserProfileResponseDto;
}
