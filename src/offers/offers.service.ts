/* eslint-disable @typescript-eslint/class-methods-use-this */
import { Injectable } from '@nestjs/common';

import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  public create(_createOfferDto: CreateOfferDto) {
    return 'This action adds a new offer';
  }

  public findAll() {
    return 'This action returns all offers';
  }

  public findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  public update(id: number, _updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  public remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
