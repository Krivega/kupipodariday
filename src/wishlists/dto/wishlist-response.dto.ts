import { ApiProperty } from '@nestjs/swagger';

import type { UserPublicProfileResponseDto } from '@/users/dto/user-public-profile-response.dto';
import type { WishPartialDto } from '@/wishes/dto/wish-partial.dto';

export class WishlistResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ example: 'Мой вишлист', minLength: 0, maxLength: 250 })
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/150?img=3' })
  image!: string;

  @ApiProperty()
  owner!: UserPublicProfileResponseDto;

  @ApiProperty({ type: 'array' })
  items!: WishPartialDto[];
}
