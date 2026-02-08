import { Test } from '@nestjs/testing';

import { WishesService } from '../wishes.service';

import type { TestingModule } from '@nestjs/testing';

describe('WishesService', () => {
  let service: WishesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishesService],
    }).compile();

    service = module.get<WishesService>(WishesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
