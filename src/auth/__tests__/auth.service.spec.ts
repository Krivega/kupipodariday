import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { UsersService } from '@/users/users.service';
import { AuthService } from '../auth.service';

import type { TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findOneByCredentials: jest.fn(),
    incrementTokenVersionUserEntity: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
