/* eslint-disable unicorn/no-null */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DataSource } from 'typeorm';

import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

import type { TestingModule } from '@nestjs/testing';
import type { Repository } from 'typeorm';
import type { CreateUserDto } from '../dto/create-user.dto';
import type { UpdateUserDto } from '../dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    tokenVersion: 0,
    username: 'johndoe',
    about: 'About me',
    avatar: 'https://i.pravatar.cc/300',
    email: 'test@example.com',
    password: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
    wishes: [],
    offers: [],
    wishlists: [],
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
    getRepository: jest.fn(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      exists: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const dto: CreateUserDto = {
        username: 'johndoe',
        email: 'test@example.com',
        password: 'secret123',
      };

      (repository.create as jest.Mock).mockReturnValue(mockUser);
      (repository.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: dto.username,
          email: dto.email,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          password: expect.any(String),
        }),
      );
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const filter = { id: 1 };

      (repository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const filter = { id: 999 };

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toBeNull();
    });

    it('should pass options to findOne', async () => {
      const filter = { email: 'test@example.com' };
      const options = { select: ['id', 'username'] as (keyof User)[] };

      (repository.findOne as jest.Mock).mockResolvedValue(mockUser);

      await service.findOne(filter, options);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
        select: ['id', 'username'],
      });
    });
  });

  describe('hasExists', () => {
    it('should return true when entity exists', async () => {
      const filter = { id: 1 };

      (repository.exists as jest.Mock).mockResolvedValue(true);

      const result = await service.hasExists(filter);

      expect(repository.exists).toHaveBeenCalledWith({ where: filter });
      expect(result).toBe(true);
    });

    it('should return false when entity does not exist', async () => {
      const filter = { email: 'nonexistent@example.com' };

      (repository.exists as jest.Mock).mockResolvedValue(false);

      const result = await service.hasExists(filter);

      expect(repository.exists).toHaveBeenCalledWith({ where: filter });
      expect(result).toBe(false);
    });

    it('should accept array filter (FindOptionsWhere[])', async () => {
      const filter = [{ username: 'user1' }, { email: 'user2@example.com' }];

      (repository.exists as jest.Mock).mockResolvedValue(true);

      const result = await service.hasExists(filter);

      expect(repository.exists).toHaveBeenCalledWith({ where: filter });
      expect(result).toBe(true);
    });
  });

  describe('findMany', () => {
    it('should return an array of users', async () => {
      const filter = { username: 'johndoe' };
      const users = [mockUser];

      (repository.find as jest.Mock).mockResolvedValue(users);

      const result = await service.findMany(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(users);
    });

    it('should return empty array when no users match', async () => {
      const filter = { id: 999 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findMany(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual([]);
    });

    it('should pass options to find', async () => {
      const filter = { email: 'test@example.com' };
      const options = { take: 10, skip: 0 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      await service.findMany(filter, options);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
        take: 10,
        skip: 0,
      });
    });
  });

  describe('update', () => {
    it('should call repository.update and return updated user', async () => {
      const filter = { id: 1 };
      const updateDto: UpdateUserDto = { about: 'Updated about' };
      const updatedUser = { ...mockUser, about: 'Updated about' };

      (repository.update as jest.Mock).mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });
      (repository.findOne as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(filter, updateDto);

      expect(repository.update).toHaveBeenCalledWith(filter, updateDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: filter });
      expect(result).toEqual(updatedUser);
    });
  });
});
