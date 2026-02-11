import { Test } from '@nestjs/testing';

import { UsersController } from '../users.controller';
import { UsersPresenter } from '../users.presenter';

import type { TestingModule } from '@nestjs/testing';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const mockUsersPresenter = {
      findOne: jest.fn(),
      findOneWithWishes: jest.fn(),
      searchByQuery: jest.fn(),
      update: jest.fn(),
      toProfile: jest.fn((u: { id: number }) => {
        return { ...u };
      }),
      toPublicProfile: jest.fn((u: { id: number }) => {
        return { ...u };
      }),
      toWishes: jest.fn((wishes: unknown[]) => {
        return wishes;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersPresenter,
          useValue: mockUsersPresenter,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
