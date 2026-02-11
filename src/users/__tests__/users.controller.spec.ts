import { Test } from '@nestjs/testing';

import { UserPresenter } from '../presenters/user.presenter';
import { UsersController } from '../users.controller';

import type { TestingModule } from '@nestjs/testing';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const mockUserPresenter = {
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
          provide: UserPresenter,
          useValue: mockUserPresenter,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
