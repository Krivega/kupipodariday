import { Test } from '@nestjs/testing';

import { WishlistsController } from '../wishlists.controller';
import { WishlistsService } from '../wishlists.service';

import type { TestingModule } from '@nestjs/testing';

describe('WishlistsController', () => {
  let controller: WishlistsController;

  beforeEach(async () => {
    const mockWishlistsService = {
      create: jest.fn(),
      findMany: jest.fn(),
      findOneWishlistEntity: jest.fn(),
      updateWishlistEntity: jest.fn(),
      removeWishlistEntity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsController],
      providers: [
        {
          provide: WishlistsService,
          useValue: mockWishlistsService,
        },
      ],
    }).compile();

    controller = module.get<WishlistsController>(WishlistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
