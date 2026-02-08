import { validate } from 'class-validator';
import { getMetadataArgsStorage } from 'typeorm';

import { User } from '../user.entity';

describe('User (schema)', () => {
  const expectedColumns = [
    'id',
    'createdAt',
    'updatedAt',
    'username',
    'about',
    'avatar',
    'email',
    'password',
  ];
  const expectedRelations = ['wishes', 'offers', 'wishlists'];

  describe('metadata', () => {
    it('entity is registered in TypeORM', () => {
      const tables = getMetadataArgsStorage().tables.filter((t) => {
        return t.target === User;
      });

      expect(tables).toHaveLength(1);
    });

    it('has all required columns', () => {
      const columns = getMetadataArgsStorage().filterColumns(User);
      const names = columns.map((c) => {
        return c.propertyName;
      });

      for (const name of expectedColumns) {
        expect(names).toContain(name);
      }

      expect(names).toHaveLength(expectedColumns.length);
    });

    it('has all required relations', () => {
      const relations = getMetadataArgsStorage().filterRelations(User);
      const names = relations.map((r) => {
        return r.propertyName;
      });

      for (const name of expectedRelations) {
        expect(names).toContain(name);
      }

      expect(names).toHaveLength(expectedRelations.length);
    });

    it('id is primary key', () => {
      const columns = getMetadataArgsStorage().filterColumns(User);
      const idCol = columns.find((c) => {
        return c.propertyName === 'id';
      });

      expect(idCol?.options.primary).toBe(true);
    });

    it('username is unique', () => {
      const columns = getMetadataArgsStorage().filterColumns(User);
      const col = columns.find((c) => {
        return c.propertyName === 'username';
      });

      expect(col?.options.unique).toBe(true);
    });

    it('email is unique', () => {
      const columns = getMetadataArgsStorage().filterColumns(User);
      const col = columns.find((c) => {
        return c.propertyName === 'email';
      });

      expect(col?.options.unique).toBe(true);
    });

    it('about has default value', () => {
      const columns = getMetadataArgsStorage().filterColumns(User);
      const col = columns.find((c) => {
        return c.propertyName === 'about';
      });

      expect(col?.options.default).toBe('Пока ничего не рассказал о себе');
    });

    it('avatar has default value', () => {
      const columns = getMetadataArgsStorage().filterColumns(User);
      const col = columns.find((c) => {
        return c.propertyName === 'avatar';
      });

      expect(col?.options.default).toBe('https://i.pravatar.cc/300');
    });
  });

  describe('validation', () => {
    it('valid instance passes', async () => {
      const user = Object.assign(new User(), {
        username: 'validuser',
        about: 'About me text',
        avatar: 'https://i.pravatar.cc/300',
        email: 'user@example.com',
        password: 'password123',
      });
      const errors = await validate(user);

      expect(errors).toHaveLength(0);
    });

    it('username: rejects shorter than 2', async () => {
      const user = Object.assign(new User(), {
        username: 'a',
        about: 'ab',
        avatar: 'https://i.pravatar.cc/300',
        email: 'a@b.com',
        password: '123456',
      });
      const errors = await validate(user);
      const usernameError = errors.find((error) => {
        return error.property === 'username';
      });

      expect(usernameError).toBeDefined();
    });

    it('username: rejects longer than 30', async () => {
      const user = Object.assign(new User(), {
        username: 'a'.repeat(31),
        about: 'ab',
        avatar: 'https://i.pravatar.cc/300',
        email: 'a@b.com',
        password: '123456',
      });
      const errors = await validate(user);
      const usernameError = errors.find((error) => {
        return error.property === 'username';
      });

      expect(usernameError).toBeDefined();
    });

    it('about: rejects shorter than 2', async () => {
      const user = Object.assign(new User(), {
        username: 'ab',
        about: 'a',
        avatar: 'https://i.pravatar.cc/300',
        email: 'a@b.com',
        password: '123456',
      });
      const errors = await validate(user);
      const aboutError = errors.find((error) => {
        return error.property === 'about';
      });

      expect(aboutError).toBeDefined();
    });

    it('avatar: rejects invalid URL', async () => {
      const user = Object.assign(new User(), {
        username: 'ab',
        about: 'ab',
        avatar: 'not-a-url',
        email: 'a@b.com',
        password: '123456',
      });
      const errors = await validate(user);
      const avatarError = errors.find((error) => {
        return error.property === 'avatar';
      });

      expect(avatarError).toBeDefined();
    });

    it('email: rejects invalid format', async () => {
      const user = Object.assign(new User(), {
        username: 'ab',
        about: 'ab',
        avatar: 'https://i.pravatar.cc/300',
        email: 'invalid',
        password: '123456',
      });
      const errors = await validate(user);
      const emailError = errors.find((error) => {
        return error.property === 'email';
      });

      expect(emailError).toBeDefined();
    });

    it('password: rejects shorter than 6', async () => {
      const user = Object.assign(new User(), {
        username: 'ab',
        about: 'ab',
        avatar: 'https://i.pravatar.cc/300',
        email: 'a@b.com',
        password: '12345',
      });
      const errors = await validate(user);
      const passwordError = errors.find((error) => {
        return error.property === 'password';
      });

      expect(passwordError).toBeDefined();
    });
  });
});
