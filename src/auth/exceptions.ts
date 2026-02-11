import { UnauthorizedException } from '@nestjs/common';

export const unauthorizedException = new UnauthorizedException(
  'Invalid username or password',
);
