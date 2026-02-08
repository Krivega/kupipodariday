/* eslint-disable @typescript-eslint/class-methods-use-this */
import { Injectable } from '@nestjs/common';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  public create(_createWishDto: CreateWishDto) {
    return 'This action adds a new wish';
  }

  public findAll() {
    return 'This action returns all wishes';
  }

  public findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  public update(id: number, _updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  public remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
