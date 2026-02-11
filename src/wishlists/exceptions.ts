import { NotFoundException, ForbiddenException } from '@nestjs/common';

export const wishlistNotFoundException = new NotFoundException(
  'Wishlist not found',
);
export const wishlistForbiddenException = new ForbiddenException(
  'You can only modify or delete your own wishlists',
);
