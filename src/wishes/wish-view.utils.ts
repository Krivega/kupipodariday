import type { WishPartialDto } from './dto/wish-partial.dto';
import type { Wish } from './entities/wish.entity';

function toWishPriceRaised(wish: Pick<Wish, 'price' | 'raised'>): {
  price: number;
  raised: number;
} {
  return {
    price: Number(wish.price),
    raised: Number(wish.raised),
  };
}

export function buildWishPartialFields(wish: Wish): WishPartialDto {
  const { price, raised } = toWishPriceRaised(wish);

  return {
    price,
    raised,
    id: wish.id,
    createdAt: wish.createdAt,
    updatedAt: wish.updatedAt,
    name: wish.name,
    link: wish.link,
    image: wish.image,
    copied: wish.copied,
    description: wish.description,
  };
}
