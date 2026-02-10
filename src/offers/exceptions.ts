import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

export const offerForOwnWishForbiddenException = new ForbiddenException(
  "You can't chip in on your own wish",
);

export const offerAlreadyFundedException = new ForbiddenException(
  "You can't chip in on a gift that's already fully funded",
);

export const offerAmountTooBigException = new BadRequestException(
  'Offer amount exceeds remaining price of the gift',
);

export const offerNotFoundException = new NotFoundException('Offer not found');
