import { PartialType } from '@nestjs/swagger';

import { CreateWishDto } from './create-wish.dto';

/**
 * Все поля опциональны. Наследует валидаторы от CreateWishDto.
 */
export class UpdateWishDto extends PartialType(CreateWishDto) {}
