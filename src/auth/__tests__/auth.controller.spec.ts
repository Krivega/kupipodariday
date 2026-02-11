import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { UserPresenter } from '@/users/presenters/user.presenter';
import { UsersService } from '@/users/users.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

import type { TestingModule } from '@nestjs/testing';

describe('AuthController', () => {
  let controller: AuthController;

  const mockUsersService = {
    hasExistsUserEntity: jest.fn(),
  };

  const mockUserPresenter = {
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: UserPresenter, useValue: mockUserPresenter },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
