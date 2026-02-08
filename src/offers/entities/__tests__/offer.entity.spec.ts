import { validate } from 'class-validator';
import { getMetadataArgsStorage } from 'typeorm';

import { Offer } from '../offer.entity';

describe('Offer (schema)', () => {
  const expectedColumns = ['id', 'createdAt', 'updatedAt', 'amount', 'hidden'];
  const expectedRelationNames = ['user', 'item'];

  describe('metadata', () => {
    it('entity is registered in TypeORM', () => {
      const tables = getMetadataArgsStorage().tables.filter((t) => {
        return t.target === Offer;
      });

      expect(tables).toHaveLength(1);
    });

    it('has all required columns', () => {
      const columns = getMetadataArgsStorage().filterColumns(Offer);
      const names = columns.map((c) => {
        return c.propertyName;
      });

      for (const name of expectedColumns) {
        expect(names).toContain(name);
      }
    });

    it('has all required relations', () => {
      const relations = getMetadataArgsStorage().filterRelations(Offer);
      const names = relations.map((r) => {
        return r.propertyName;
      });

      for (const name of expectedRelationNames) {
        expect(names).toContain(name);
      }
    });

    it('id is primary key', () => {
      const columns = getMetadataArgsStorage().filterColumns(Offer);
      const idCol = columns.find((c) => {
        return c.propertyName === 'id';
      });

      expect(idCol?.options.primary).toBe(true);
    });

    it('amount has default 0', () => {
      const columns = getMetadataArgsStorage().filterColumns(Offer);
      const col = columns.find((c) => {
        return c.propertyName === 'amount';
      });

      expect(col?.options.default).toBe(0);
    });

    it('hidden has default false', () => {
      const columns = getMetadataArgsStorage().filterColumns(Offer);
      const col = columns.find((c) => {
        return c.propertyName === 'hidden';
      });

      expect(col?.options.default).toBe(false);
    });

    it('amount has decimal precision', () => {
      const columns = getMetadataArgsStorage().filterColumns(Offer);
      const col = columns.find((c) => {
        return c.propertyName === 'amount';
      });

      expect(col?.options.precision).toBe(10);
      expect(col?.options.scale).toBe(2);
    });
  });

  describe('validation', () => {
    it('valid instance passes', async () => {
      const offer = Object.assign(new Offer(), {
        amount: 10.5,
        hidden: false,
      });
      const errors = await validate(offer);

      expect(errors).toHaveLength(0);
    });

    it('amount: rejects negative', async () => {
      const offer = Object.assign(new Offer(), {
        amount: -1,
        hidden: false,
      });
      const errors = await validate(offer);
      const amountError = errors.find((error) => {
        return error.property === 'amount';
      });

      expect(amountError).toBeDefined();
    });

    it('hidden: rejects non-boolean', async () => {
      const offer = Object.assign(new Offer(), {
        amount: 0,
        hidden: 'yes' as unknown as boolean,
      });
      const errors = await validate(offer);
      const hiddenError = errors.find((error) => {
        return error.property === 'hidden';
      });

      expect(hiddenError).toBeDefined();
    });
  });
});
