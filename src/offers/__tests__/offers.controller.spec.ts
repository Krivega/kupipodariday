import { Test } from '@nestjs/testing';

import { OffersController } from '../offers.controller';
import { OffersPresenter } from '../offers.presenter';

import type { TestingModule } from '@nestjs/testing';

describe('OffersController', () => {
  let controller: OffersController;

  beforeEach(async () => {
    const mockOfferPresenter = {
      create: jest.fn(),
      findManyForView: jest.fn(),
      findOneForView: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        {
          provide: OffersPresenter,
          useValue: mockOfferPresenter,
        },
      ],
    }).compile();

    controller = module.get<OffersController>(OffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
