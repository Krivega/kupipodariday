/* eslint-disable unicorn/no-null */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Wish } from '@/wishes/entities/wish.entity';
import { Wishlist } from '../entities/wishlist.entity';
import { WishlistsService } from '../wishlists.service';

import type { TestingModule } from '@nestjs/testing';
import type { Repository } from 'typeorm';
import type { User } from '@/users/entities/user.entity';
import type { CreateWishlistDto } from '../dto/create-wishlist.dto';
import type { UpdateWishlistDto } from '../dto/update-wishlist.dto';

describe('WishlistsService', () => {
  let service: WishlistsService;
  let repository: jest.Mocked<Repository<Wishlist>>;
  let wishRepository: jest.Mocked<Repository<Wish>>;

  const mockWishlist: Wishlist = {
    id: 1,
    name: 'My wishlist',
    description: 'Description',
    image: 'https://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {} as never,
    items: [],
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

    const mockWishRepository = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistsService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Wish),
          useValue: mockWishRepository,
        },
      ],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
    repository = module.get(getRepositoryToken(Wishlist));
    wishRepository = module.get(getRepositoryToken(Wish)) as jest.Mocked<
      Repository<Wish>
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a wishlist', async () => {
      const dto = {
        name: 'My wishlist',
        description: 'Description',
        image: 'https://example.com/image.jpg',
        owner: { id: 1 },
      } as unknown as CreateWishlistDto & { owner: User };

      (repository.create as jest.Mock).mockReturnValue(mockWishlist);
      (repository.save as jest.Mock).mockResolvedValue(mockWishlist);
      (repository.findOne as jest.Mock).mockResolvedValue(mockWishlist);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith({
        name: 'My wishlist',
        description: 'Description',
        image: 'https://example.com/image.jpg',
        owner: { id: 1 },
      });
      expect(repository.save).toHaveBeenCalledWith(mockWishlist);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockWishlist.id },
        relations: ['owner', 'items'],
      });
      expect(result).toEqual(mockWishlist);
    });

    it('should create wishlist and link existing wishes by itemsId', async () => {
      const dto = {
        name: 'My wishlist',
        description: 'Description',
        image: 'https://example.com/image.jpg',
        owner: { id: 1 },
        itemsId: [10, 20],
      } as unknown as CreateWishlistDto & { owner: User };

      (repository.create as jest.Mock).mockReturnValue(mockWishlist);
      (repository.save as jest.Mock).mockResolvedValue(mockWishlist);
      (repository.findOne as jest.Mock).mockResolvedValue({
        ...mockWishlist,
        items: [{ id: 10 }, { id: 20 }],
      });
      wishRepository.update.mockResolvedValue({
        affected: 2,
        raw: [],
        generatedMaps: [],
      });

      const result = await service.create(dto);

      expect(wishRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: { id: 1 },
        }),
        { wishlist: mockWishlist },
      );
      expect(result.items).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a wishlist when found', async () => {
      const filter = { id: 1 };

      (repository.findOne as jest.Mock).mockResolvedValue(mockWishlist);

      const result = await service.findOne(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(mockWishlist);
    });

    it('should return null when wishlist not found', async () => {
      const filter = { id: 999 };

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toBeNull();
    });

    it('should pass options to findOne', async () => {
      const filter = { id: 1 };
      const options = { select: ['id', 'name'] as (keyof Wishlist)[] };

      (repository.findOne as jest.Mock).mockResolvedValue(mockWishlist);

      await service.findOne(filter, options);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
        select: ['id', 'name'],
      });
    });
  });

  describe('findMany', () => {
    it('should return an array of wishlists', async () => {
      const filter = { id: 1 };
      const wishlists = [mockWishlist];

      (repository.find as jest.Mock).mockResolvedValue(wishlists);

      const result = await service.findMany(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(wishlists);
    });

    it('should return empty array when no wishlists match', async () => {
      const filter = { id: 999 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findMany(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual([]);
    });

    it('should pass options to find', async () => {
      const filter = { id: 1 };
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
    it('should call repository.update with filter and dto', async () => {
      const filter = { id: 1 };
      const updateDto: UpdateWishlistDto = { name: 'Updated name' };
      const updateResult = { affected: 1, raw: [], generatedMaps: [] };

      (repository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await service.update(filter, updateDto);

      expect(repository.update).toHaveBeenCalledWith(filter, updateDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should call repository.delete with filter', async () => {
      const filter = { id: 1 };
      const deleteResult = { affected: 1, raw: [] };

      (repository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await service.remove(filter);

      expect(repository.delete).toHaveBeenCalledWith(filter);
      expect(result).toEqual(deleteResult);
    });
  });
});
