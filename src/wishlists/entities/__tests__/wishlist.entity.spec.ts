import { validate } from 'class-validator';
import { getMetadataArgsStorage } from 'typeorm';

import { Wishlist } from '../wishlist.entity';

describe('Wishlist (schema)', () => {
  const expectedColumns = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'description',
    'image',
  ];
  const expectedRelationNames = ['owner', 'items'];

  describe('metadata', () => {
    it('entity is registered in TypeORM', () => {
      const tables = getMetadataArgsStorage().tables.filter((table) => {
        return table.target === Wishlist;
      });

      expect(tables).toHaveLength(1);
    });

    it('has all required columns', () => {
      const columns = getMetadataArgsStorage().filterColumns(Wishlist);
      const names = columns.map((c) => {
        return c.propertyName;
      });

      for (const name of expectedColumns) {
        expect(names).toContain(name);
      }
    });

    it('has all required relations', () => {
      const relations = getMetadataArgsStorage().filterRelations(Wishlist);
      const names = relations.map((r) => {
        return r.propertyName;
      });

      for (const name of expectedRelationNames) {
        expect(names).toContain(name);
      }
    });

    it('id is primary key', () => {
      const columns = getMetadataArgsStorage().filterColumns(Wishlist);
      const idCol = columns.find((c) => {
        return c.propertyName === 'id';
      });

      expect(idCol?.options.primary).toBe(true);
    });
  });

  describe('validation', () => {
    const validWishlist = {
      name: 'My wishlist',
      description: 'Description of the list',
      image: 'https://example.com/cover.jpg',
    };

    it('valid instance passes', async () => {
      const wishlist = Object.assign(new Wishlist(), validWishlist);
      const errors = await validate(wishlist);

      expect(errors).toHaveLength(0);
    });

    it('name: rejects empty', async () => {
      const wishlist = Object.assign(new Wishlist(), {
        ...validWishlist,
        name: '',
      });
      const errors = await validate(wishlist);
      const nameError = errors.find((error) => {
        return error.property === 'name';
      });

      expect(nameError).toBeDefined();
    });

    it('name: rejects longer than 250', async () => {
      const wishlist = Object.assign(new Wishlist(), {
        ...validWishlist,
        name: 'a'.repeat(251),
      });
      const errors = await validate(wishlist);
      const nameError = errors.find((error) => {
        return error.property === 'name';
      });

      expect(nameError).toBeDefined();
    });

    it('description: rejects empty', async () => {
      const wishlist = Object.assign(new Wishlist(), {
        ...validWishlist,
        description: '',
      });
      const errors = await validate(wishlist);
      const descError = errors.find((error) => {
        return error.property === 'description';
      });

      expect(descError).toBeDefined();
    });

    it('description: rejects longer than 1500', async () => {
      const wishlist = Object.assign(new Wishlist(), {
        ...validWishlist,
        description: 'a'.repeat(1501),
      });
      const errors = await validate(wishlist);
      const descError = errors.find((error) => {
        return error.property === 'description';
      });

      expect(descError).toBeDefined();
    });

    it('image: rejects invalid URL', async () => {
      const wishlist = Object.assign(new Wishlist(), {
        ...validWishlist,
        image: 'not-a-url',
      });
      const errors = await validate(wishlist);
      const imageError = errors.find((error) => {
        return error.property === 'image';
      });

      expect(imageError).toBeDefined();
    });
  });
});
