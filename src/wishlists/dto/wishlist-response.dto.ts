import type { UserProfileResponseDto } from '@/users/dto/user-profile-response.dto';
import type { WishResponseDto } from '@/wishes/dto/wish-response.dto';

export type WishlistResponseDto = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description?: string;
  image: string;
  owner: UserProfileResponseDto;
  items: WishResponseDto[];
};
