import { Test } from '@nestjs/testing';

import { WishlistsController } from '../wishlists.controller';
import { WishlistsService } from '../wishlists.service';

import type { TestingModule } from '@nestjs/testing';

describe('WishlistsController', () => {
  let controller: WishlistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsController],
      providers: [WishlistsService],
    }).compile();

    controller = module.get<WishlistsController>(WishlistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
