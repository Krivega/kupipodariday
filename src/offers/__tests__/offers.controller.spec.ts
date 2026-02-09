import { Test } from '@nestjs/testing';

import { OffersController } from '../offers.controller';
import { OffersService } from '../offers.service';

import type { TestingModule } from '@nestjs/testing';

describe('OffersController', () => {
  let controller: OffersController;

  beforeEach(async () => {
    const mockOffersService = {
      create: jest.fn(),
      findMany: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        {
          provide: OffersService,
          useValue: mockOffersService,
        },
      ],
    }).compile();

    controller = module.get<OffersController>(OffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
