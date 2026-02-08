import { validate } from 'class-validator';
import { getMetadataArgsStorage } from 'typeorm';

import { Wish } from '../wish.entity';

describe('Wish (schema)', () => {
  const expectedColumnNames = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'link',
    'image',
    'price',
    'raised',
    'copied',
    'description',
  ];
  const expectedRelationNames = ['owner', 'offers', 'wishlist'];

  describe('metadata', () => {
    it('entity is registered in TypeORM', () => {
      const tables = getMetadataArgsStorage().tables.filter((t) => {
        return t.target === Wish;
      });

      expect(tables).toHaveLength(1);
    });

    it('has all required columns', () => {
      const columns = getMetadataArgsStorage().filterColumns(Wish);
      const names = columns.map((c) => {
        return c.propertyName;
      });

      for (const name of expectedColumnNames) {
        expect(names).toContain(name);
      }

      expect(names).toHaveLength(expectedColumnNames.length);
    });

    it('has all required relations', () => {
      const relations = getMetadataArgsStorage().filterRelations(Wish);
      const names = relations.map((r) => {
        return r.propertyName;
      });

      for (const name of expectedRelationNames) {
        expect(names).toContain(name);
      }
    });

    it('id is primary key', () => {
      const columns = getMetadataArgsStorage().filterColumns(Wish);
      const idCol = columns.find((c) => {
        return c.propertyName === 'id';
      });

      expect(idCol?.options.primary).toBe(true);
    });

    it('raised has default 0', () => {
      const columns = getMetadataArgsStorage().filterColumns(Wish);
      const col = columns.find((c) => {
        return c.propertyName === 'raised';
      });

      expect(col?.options.default).toBe(0);
    });

    it('copied has default 0', () => {
      const columns = getMetadataArgsStorage().filterColumns(Wish);
      const col = columns.find((c) => {
        return c.propertyName === 'copied';
      });

      expect(col?.options.default).toBe(0);
    });

    it('price has decimal precision', () => {
      const columns = getMetadataArgsStorage().filterColumns(Wish);
      const col = columns.find((c) => {
        return c.propertyName === 'price';
      });

      expect(col?.options.precision).toBe(10);
      expect(col?.options.scale).toBe(2);
    });
  });

  describe('validation', () => {
    const validWish = {
      name: 'Gift name',
      link: 'https://example.com/item',
      image: 'https://example.com/image.jpg',
      price: 99.99,
      raised: 0,
      copied: 0,
      description: 'Description text',
    };

    it('valid instance passes', async () => {
      const wish = Object.assign(new Wish(), validWish);
      const errors = await validate(wish);

      expect(errors).toHaveLength(0);
    });

    it('name: rejects empty', async () => {
      const wish = Object.assign(new Wish(), {
        ...validWish,
        name: '',
      });
      const errors = await validate(wish);
      const nameError = errors.find((error) => {
        return error.property === 'name';
      });

      expect(nameError).toBeDefined();
    });

    it('name: rejects longer than 250', async () => {
      const wish = Object.assign(new Wish(), {
        ...validWish,
        name: 'a'.repeat(251),
      });
      const errors = await validate(wish);
      const nameError = errors.find((error) => {
        return error.property === 'name';
      });

      expect(nameError).toBeDefined();
    });

    it('link: rejects invalid URL', async () => {
      const wish = Object.assign(new Wish(), {
        ...validWish,
        link: 'not-a-url',
      });
      const errors = await validate(wish);
      const linkError = errors.find((error) => {
        return error.property === 'link';
      });

      expect(linkError).toBeDefined();
    });

    it('image: rejects invalid URL', async () => {
      const wish = Object.assign(new Wish(), {
        ...validWish,
        image: 'not-a-url',
      });
      const errors = await validate(wish);
      const imageError = errors.find((error) => {
        return error.property === 'image';
      });

      expect(imageError).toBeDefined();
    });

    it('price: rejects less than 0.01', async () => {
      const wish = Object.assign(new Wish(), {
        ...validWish,
        price: 0,
      });
      const errors = await validate(wish);
      const priceError = errors.find((error) => {
        return error.property === 'price';
      });

      expect(priceError).toBeDefined();
    });

    it('description: rejects empty', async () => {
      const wish = Object.assign(new Wish(), {
        ...validWish,
        description: '',
      });
      const errors = await validate(wish);
      const descError = errors.find((error) => {
        return error.property === 'description';
      });

      expect(descError).toBeDefined();
    });

    it('description: rejects longer than 1024', async () => {
      const wish = Object.assign(new Wish(), {
        ...validWish,
        description: 'a'.repeat(1025),
      });
      const errors = await validate(wish);
      const descError = errors.find((error) => {
        return error.property === 'description';
      });

      expect(descError).toBeDefined();
    });
  });
});
