import type { OfferResponseDto } from '@/offers/dto/offer-response.dto';
import type { UserProfileResponseDto } from '@/users/dto/user-profile-response.dto';

export type WishResponseDto = {
  id: number;
  name: string;
  link: string;
  image: string;
  price: number;
  raised: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  owner: UserProfileResponseDto;
  offers: OfferResponseDto[];
};
