import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { OffersService } from '@/offers/offers.service';
import { toUserProfileResponseDto } from '@/users/dto/user-profile-response.dto';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

import type { User } from '@/users/entities/user.entity';

@Injectable()
export class WishesService {
  public constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @Inject(
      forwardRef(() => {
        return OffersService;
      }),
    )
    private readonly offersService: OffersService,
  ) {}

  // ——— Pure CRUD ———

  // ——— Private helpers ———

  public createWishEntity(
    createWishDto: CreateWishDto & { owner: User },
  ): Wish {
    return this.wishRepository.create(createWishDto);
  }

  public async findOneWishEntity(
    filter: FindOptionsWhere<Wish>,
    options?: Omit<FindManyOptions<Wish>, 'where'>,
  ): Promise<Wish | null> {
    return this.wishRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findManyWishEntity(
    filter?: FindOptionsWhere<Wish>,
    options?: Omit<FindManyOptions<Wish>, 'where'>,
  ): Promise<Wish[]> {
    return this.wishRepository.find({
      ...options,
      where: filter,
    });
  }

  public async saveWishEntity(wish: Wish): Promise<Wish> {
    return this.wishRepository.save(wish);
  }

  public async updateWishEntity(
    filter: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto & { copied?: number },
  ) {
    return this.wishRepository.update(filter, updateWishDto);
  }

  public async removeWishEntity(filter: FindOptionsWhere<Wish>) {
    return this.wishRepository.delete(filter);
  }

  // ——— Business logic & data processing ———

  public async create(
    createWishDto: CreateWishDto & { owner: User },
  ): Promise<Wish> {
    const wish = this.createWishEntity(createWishDto);

    return this.saveWishEntity(wish);
  }

  public async copy({ id, userId }: { id: number; userId: number }) {
    const wish = await this.findOneWishEntity({ id: Number(id) });

    if (!wish) {
      return undefined;
    }

    await this.updateWishEntity(
      { id: Number(id) },
      { copied: wish.copied + 1 },
    );

    return this.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: { id: userId } as User,
    });
  }

  /**
   * Формирует DTO подарка для конкретного пользователя с учётом того,
   * свой это подарок или чужой, а также скрытых заявок.
   */
  public buildWishViewForUser(wish: Wish, currentUserId: number) {
    const raised = this.offersService.calculateRaisedFromOffers(
      wish.offers,
      currentUserId,
    );

    return {
      raised,
      id: wish.id,
      name: wish.name,
      price: wish.price,
      image: wish.image,
      link: wish.link,
      description: wish.description,
      createdAt: wish.createdAt,
      updatedAt: wish.updatedAt,
      owner: toUserProfileResponseDto(wish.owner),
      offers: this.offersService.buildOffersViewForUser(
        wish.offers,
        currentUserId,
      ),
    };
  }
}
