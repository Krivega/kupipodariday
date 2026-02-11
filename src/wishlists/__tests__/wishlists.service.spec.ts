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
      find: jest.fn(),
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

  describe('createWishlistEntity', () => {
    it('should create wishlist entity', () => {
      const dto = {
        name: 'My wishlist',
        description: 'Description',
        image: 'https://example.com/image.jpg',
        owner: { id: 1 },
      } as unknown as CreateWishlistDto & { owner: User };

      (repository.create as jest.Mock).mockReturnValue(mockWishlist);

      const result = service.createWishlistEntity(dto);

      expect(repository.create).toHaveBeenCalledWith({
        name: 'My wishlist',
        description: 'Description',
        image: 'https://example.com/image.jpg',
        owner: { id: 1 },
      });
      expect(result).toMatchObject({
        id: mockWishlist.id,
        name: mockWishlist.name,
        items: [],
      });
    });
  });

  describe('linkItemsToWishlist', () => {
    it('should link existing wishes to wishlist', async () => {
      const dto = {
        name: 'My wishlist',
        description: 'Description',
        image: 'https://example.com/image.jpg',
        owner: { id: 1 },
        itemsId: [10, 20],
      } as unknown as CreateWishlistDto & { owner: User };

      (repository.create as jest.Mock).mockReturnValue(mockWishlist);
      (repository.save as jest.Mock).mockResolvedValue(mockWishlist);
      wishRepository.update.mockResolvedValue({
        affected: 2,
        raw: [],
        generatedMaps: [],
      });

      const wishlist = service.createWishlistEntity(dto);
      const savedWishlist = { ...wishlist };

      const wishes = [
        { id: 10, name: 'Wish 1' },
        { id: 20, name: 'Wish 2' },
      ];

      wishRepository.find.mockResolvedValue(wishes as unknown as Wish[]);
      (repository.save as jest.Mock).mockResolvedValue({
        ...savedWishlist,
        items: wishes,
      });

      await service.linkItemsToWishlist(savedWishlist, [10, 20], 1);

      expect(wishRepository.find).toHaveBeenCalledWith({
        where: {
          id: expect.any(Number) as number,
          owner: { id: 1 },
        },
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          items: wishes,
        }),
      );
    });
  });

  describe('findOneWishlistEntity', () => {
    it('should return a wishlist when found', async () => {
      const filter = { id: 1 };

      (repository.findOne as jest.Mock).mockResolvedValue(mockWishlist);

      const result = await service.findOneWishlistEntity(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(mockWishlist);
    });

    it('should return null when wishlist not found', async () => {
      const filter = { id: 999 };

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneWishlistEntity(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toBeNull();
    });

    it('should pass options to findOneWishlistEntity', async () => {
      const filter = { id: 1 };
      const options = { select: ['id', 'name'] as (keyof Wishlist)[] };

      (repository.findOne as jest.Mock).mockResolvedValue(mockWishlist);

      await service.findOneWishlistEntity(filter, options);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
        select: ['id', 'name'],
      });
    });
  });

  describe('findManyWishlistEntity', () => {
    it('should return an array of wishlists', async () => {
      const filter = { id: 1 };
      const wishlists = [mockWishlist];

      (repository.find as jest.Mock).mockResolvedValue(wishlists);

      const result = await service.findManyWishlistEntity(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: mockWishlist.id,
        name: mockWishlist.name,
      });
    });

    it('should return empty array when no wishlists match', async () => {
      const filter = { id: 999 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findManyWishlistEntity(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual([]);
    });

    it('should pass options to find', async () => {
      const filter = { id: 1 };
      const options = { take: 10, skip: 0 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      await service.findManyWishlistEntity(filter, options);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
        take: 10,
        skip: 0,
      });
    });
  });

  describe('updateWishlistEntity', () => {
    it('should call repository.update with filter and dto', async () => {
      const filter = { id: 1 };
      const updateDto: UpdateWishlistDto = { name: 'Updated name' };
      const updateResult = { affected: 1, raw: [], generatedMaps: [] };

      (repository.update as jest.Mock).mockResolvedValue(updateResult);

      const result = await service.updateWishlistEntity(filter, updateDto);

      expect(repository.update).toHaveBeenCalledWith(filter, updateDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('removeWishlistEntity', () => {
    it('should call repository.delete with filter', async () => {
      const filter = { id: 1 };
      const deleteResult = { affected: 1, raw: [] };

      (repository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await service.removeWishlistEntity(filter);

      expect(repository.delete).toHaveBeenCalledWith(filter);
      expect(result).toEqual(deleteResult);
    });
  });
});
