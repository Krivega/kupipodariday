import { Test } from '@nestjs/testing';

import { WishlistPresenter } from '../presenters/wishlist.presenter';
import { WishlistsController } from '../wishlists.controller';

import type { TestingModule } from '@nestjs/testing';

describe('WishlistsController', () => {
  let controller: WishlistsController;

  beforeEach(async () => {
    const mockWishlistPresenter = {
      create: jest.fn(),
      findManyForView: jest.fn(),
      findOneForView: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsController],
      providers: [
        {
          provide: WishlistPresenter,
          useValue: mockWishlistPresenter,
        },
      ],
    }).compile();

    controller = module.get<WishlistsController>(WishlistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
