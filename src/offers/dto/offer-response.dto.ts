import type { UserProfileResponseDto } from '@/users/dto/user-profile-response.dto';
import type { Wish } from '@/wishes/entities/wish.entity';

export type OfferResponseDto = {
  id: number;
  amount: number;
  hidden: boolean;
  item: Wish;
  user?: UserProfileResponseDto;
};
