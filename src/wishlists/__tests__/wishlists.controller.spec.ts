import { Test } from '@nestjs/testing';

import { WishlistsController } from '../wishlists.controller';
import { WishlistsPresenter } from '../wishlists.presenter';

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
          provide: WishlistsPresenter,
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
