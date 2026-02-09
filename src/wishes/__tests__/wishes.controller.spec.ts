import { Test } from '@nestjs/testing';

import { WishesController } from '../wishes.controller';
import { WishesService } from '../wishes.service';

import type { TestingModule } from '@nestjs/testing';

describe('WishesController', () => {
  let controller: WishesController;

  beforeEach(async () => {
    const mockWishesService = {
      create: jest.fn(),
      findMany: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishesController],
      providers: [
        {
          provide: WishesService,
          useValue: mockWishesService,
        },
      ],
    }).compile();

    controller = module.get<WishesController>(WishesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
