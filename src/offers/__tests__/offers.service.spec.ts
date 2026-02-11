/* eslint-disable unicorn/no-null */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Offer } from '../entities/offer.entity';
import { OffersService } from '../offers.service';

import type { TestingModule } from '@nestjs/testing';
import type { Repository } from 'typeorm';
import type { Wish } from '@/wishes/entities/wish.entity';
import type { CreateOfferDto } from '../dto/create-offer.dto';

describe('OffersService', () => {
  let service: OffersService;
  let repository: jest.Mocked<Repository<Offer>>;

  const mockOffer: Offer = {
    id: 1,
    amount: 100,
    hidden: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {} as never,
    item: {} as never,
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
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
    repository = module.get(getRepositoryToken(Offer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOfferEntity', () => {
    it('should create offer entity', () => {
      const dto = {
        amount: 100,
        hidden: false,
        itemId: 1,
        user: { id: 2 },
      } as unknown as CreateOfferDto & { user: { id: number } };

      const mockWish = {
        id: 1,
        price: 200,
        owner: { id: 3 },
        offers: [],
      } as unknown as Wish;

      (repository.create as jest.Mock).mockReturnValue(mockOffer);

      const result = service.createOfferEntity(dto, mockWish);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: dto.amount,
          hidden: dto.hidden,
          item: { id: mockWish.id },
          user: { id: dto.user.id },
        }),
      );
      expect(result).toEqual(mockOffer);
    });
  });

  describe('findOneOfferEntity', () => {
    it('should return an offer when found', async () => {
      const filter = { id: 1 };

      (repository.findOne as jest.Mock).mockResolvedValue(mockOffer);

      const result = await service.findOneOfferEntity(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(mockOffer);
    });

    it('should return null when offer not found', async () => {
      const filter = { id: 999 };

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneOfferEntity(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toBeNull();
    });

    it('should pass options to findOne', async () => {
      const filter = { id: 1 };
      const options = { select: ['id', 'amount'] as (keyof Offer)[] };

      (repository.findOne as jest.Mock).mockResolvedValue(mockOffer);

      await service.findOneOfferEntity(filter, options);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
        select: ['id', 'amount'],
      });
    });
  });

  describe('findManyOfferEntity', () => {
    it('should return an array of offers', async () => {
      const filter = { id: 1 };
      const offers = [mockOffer];

      (repository.find as jest.Mock).mockResolvedValue(offers);

      const result = await service.findManyOfferEntity(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(offers);
    });

    it('should return empty array when no offers match', async () => {
      const filter = { id: 999 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findManyOfferEntity(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual([]);
    });

    it('should pass options to find', async () => {
      const filter = { id: 1 };
      const options = { take: 10, skip: 0 };

      (repository.find as jest.Mock).mockResolvedValue([]);

      await service.findManyOfferEntity(filter, options);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
        take: 10,
        skip: 0,
      });
    });
  });
});
