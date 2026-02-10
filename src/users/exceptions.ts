import { ConflictException, NotFoundException } from '@nestjs/common';

export const userNotFoundException = new NotFoundException('User not found');
export const userAlreadyExistsException = new ConflictException(
  'Пользователь с таким email или username уже зарегистрирован',
);
