import { Test } from '@nestjs/testing';

import { WishPresenter } from '../presenters/wish.presenter';
import { WishesController } from '../wishes.controller';

import type { TestingModule } from '@nestjs/testing';

describe('WishesController', () => {
  let controller: WishesController;

  beforeEach(async () => {
    const mockWishPresenter = {
      findManyLast: jest.fn(),
      findManyTop: jest.fn(),
      findOneForView: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      copy: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishesController],
      providers: [
        {
          provide: WishPresenter,
          useValue: mockWishPresenter,
        },
      ],
    }).compile();

    controller = module.get<WishesController>(WishesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
