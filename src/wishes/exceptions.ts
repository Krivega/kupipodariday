import { NotFoundException, ForbiddenException } from '@nestjs/common';

export const wishNotFoundException = new NotFoundException('Wish not found');
export const wishForbiddenException = new ForbiddenException('');
export const wishChangePriceForbiddenException = new ForbiddenException(
  "You can't change the wish if there are already users willing to chip in",
);
