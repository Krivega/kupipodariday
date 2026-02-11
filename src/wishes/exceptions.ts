import { NotFoundException, ForbiddenException } from '@nestjs/common';

export const wishNotFoundException = new NotFoundException('Wish not found');
export const wishForbiddenException = new ForbiddenException(
  'You can only modify or delete your own wishes',
);
export const wishChangePriceForbiddenException = new ForbiddenException(
  "You can't change the wish if there are already users willing to chip in",
);
