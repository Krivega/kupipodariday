/* eslint-disable unicorn/no-null */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Wish } from '../entities/wish.entity';
import { WishesService } from '../wishes.service';

import type { TestingModule } from '@nestjs/testing';
import type { Repository } from 'typeorm';
import type { User } from '@/users/entities/user.entity';
import type { CreateWishDto } from '../dto/create-wish.dto';
import type { UpdateWishDto } from '../dto/update-wish.dto';

describe('WishesService', () => {
  let service: WishesService;
  let repository: jest.Mocked<Repository<Wish>>;

  const mockWish: Wish = {
    id: 1,
    name: 'My wish',
    link: 'https://example.com/product',
    image: 'https://example.com/image.jpg',
    price: 99.99,
    raised: 0,
    copied: 0,
    description: 'Description',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {} as never,
    offers: [],
    wishlists: [],
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishesService,
        {
          provide: getRepositoryToken(Wish),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WishesService>(WishesService);
    repository = module.get(getRepositoryToken(Wish));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWish', () => {
    it('should create and save a wish', async () => {
      const dto = {
        name: 'My wish',
        link: 'https://example.com/product',
        image: 'https://example.com/image.jpg',
        price: 99.99,
        description: 'Description',
        owner: { id: 1 },
      } as unknown as CreateWishDto & { owner: User };

      (repository.create as jest.Mock).mockReturnValue(mockWish);
      (repository.save as jest.Mock).mockResolvedValue(mockWish);

      const result = await service.createAndSaveWishEntity(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockWish);
      expect(result).toEqual(mockWish);
    });
  });

  describe('findOneWishEntity', () => {
    it('should return a wish when found', async () => {
      const filter = { id: 1 };

      (repository.findOne as jest.Mock).mockResolvedValue(mockWish);

      const result = await service.findOneWishEntity(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(mockWish);
    });

    it('should return null when wish not found', async () => {
      const filter = { id: 999 };

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneWishEntity(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toBeNull();
    });

    it('should pass options to findOne', async () => {
      const filter = { id: 1 };
      const options = { select: ['id', 'name'] as (keyof Wish)[] };

      (repository.findOne as jest.Mock).mockResolvedValue(mockWish);

      await service.findOneWishEntity(filter, options);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
        select: ['id', 'name'],
      });
    });
  });

  describe('findManyWishEntity', () => {
    it('should return an array of wishes', async () => {
      const filter = { id: 1 };
      const wishes = [mockWish];

      (repository.find as jest.Mock).mockResolvedValue(wishes);

      const result = await service.findManyWishEntity(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(wishes);
    });

    it('should return empty array when no wishes match', async () => {
      const filter = { id: 999 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findManyWishEntity(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual([]);
    });

    it('should pass options to find', async () => {
      const filter = { id: 1 };
      const options = { take: 10, skip: 0 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      await service.findManyWishEntity(filter, options);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
        take: 10,
        skip: 0,
      });
    });
  });

  describe('updateWishEntity', () => {
    it('should call repository.update with filter and dto', async () => {
      const filter = { id: 1 };
      const updateDto: UpdateWishDto = { name: 'Updated name' };
      const updateResult = { affected: 1, raw: [], generatedMaps: [] };

      (repository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await service.updateWishEntity(filter, updateDto);

      expect(repository.update).toHaveBeenCalledWith(filter, updateDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('removeWishEntity', () => {
    it('should call repository.delete with filter', async () => {
      const filter = { id: 1 };
      const deleteResult = { affected: 1, raw: [] };

      (repository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await service.removeWishEntity(filter);

      expect(repository.delete).toHaveBeenCalledWith(filter);
      expect(result).toEqual(deleteResult);
    });
  });
});
