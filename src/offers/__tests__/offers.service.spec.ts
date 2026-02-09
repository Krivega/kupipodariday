/* eslint-disable unicorn/no-null */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Offer } from '../entities/offer.entity';
import { OffersService } from '../offers.service';

import type { TestingModule } from '@nestjs/testing';
import type { Repository } from 'typeorm';
import type { CreateOfferDto } from '../dto/create-offer.dto';
import type { UpdateOfferDto } from '../dto/update-offer.dto';

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

  describe('create', () => {
    it('should create and save an offer', async () => {
      const dto: CreateOfferDto = {};

      (repository.create as jest.Mock).mockReturnValue(mockOffer);
      (repository.save as jest.Mock).mockResolvedValue(mockOffer);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockOffer);
      expect(result).toEqual(mockOffer);
    });
  });

  describe('findOne', () => {
    it('should return an offer when found', async () => {
      const filter = { id: 1 };

      (repository.findOne as jest.Mock).mockResolvedValue(mockOffer);

      const result = await service.findOne(filter);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(mockOffer);
    });

    it('should return null when offer not found', async () => {
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
      const options = { select: ['id', 'amount'] as (keyof Offer)[] };

      (repository.findOne as jest.Mock).mockResolvedValue(mockOffer);

      await service.findOne(filter, options);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: filter,
        select: ['id', 'amount'],
      });
    });
  });

  describe('findMany', () => {
    it('should return an array of offers', async () => {
      const filter = { id: 1 };
      const offers = [mockOffer];

      (repository.find as jest.Mock).mockResolvedValue(offers);

      const result = await service.findMany(filter);

      expect(repository.find).toHaveBeenCalledWith({
        where: filter,
      });
      expect(result).toEqual(offers);
    });

    it('should return empty array when no offers match', async () => {
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
      const updateDto: UpdateOfferDto = { amount: 200 };
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
