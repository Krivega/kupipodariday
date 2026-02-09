import { validate } from 'class-validator';

import { CreateUserDto } from '../create-user.dto';

function validDto(overrides: Partial<CreateUserDto> = {}): CreateUserDto {
  return Object.assign(new CreateUserDto(), {
    username: 'johndoe',
    email: 'test@example.com',
    password: 'secret123',
    ...overrides,
  });
}

describe('CreateUserDto', () => {
  describe('validation', () => {
    it('valid instance passes', async () => {
      const dto = validDto();
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('valid instance with optional fields passes', async () => {
      const dto = validDto({
        about: 'Пока ничего не рассказал о себе',
        avatar: 'https://i.pravatar.cc/300',
      });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('valid instance without optional fields passes', async () => {
      const dto = validDto();

      delete (dto as Partial<CreateUserDto>).about;
      delete (dto as Partial<CreateUserDto>).avatar;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    describe('username', () => {
      it('rejects empty', async () => {
        const dto = validDto({ username: '' });
        const errors = await validate(dto);
        const usernameError = errors.find((error) => {
          return error.property === 'username';
        });

        expect(usernameError).toBeDefined();
      });

      it('rejects shorter than 2', async () => {
        const dto = validDto({ username: 'a' });
        const errors = await validate(dto);
        const usernameError = errors.find((error) => {
          return error.property === 'username';
        });

        expect(usernameError).toBeDefined();
      });

      it('rejects longer than 30', async () => {
        const dto = validDto({ username: 'a'.repeat(31) });
        const errors = await validate(dto);
        const usernameError = errors.find((error) => {
          return error.property === 'username';
        });

        expect(usernameError).toBeDefined();
      });

      it('accepts 2 characters', async () => {
        const dto = validDto({ username: 'ab' });
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('accepts 30 characters', async () => {
        const dto = validDto({ username: 'a'.repeat(30) });
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });
    });

    describe('about', () => {
      it('rejects shorter than 2 when provided', async () => {
        const dto = validDto({ about: 'a' });
        const errors = await validate(dto);
        const aboutError = errors.find((error) => {
          return error.property === 'about';
        });

        expect(aboutError).toBeDefined();
      });

      it('rejects longer than 200 when provided', async () => {
        const dto = validDto({ about: 'a'.repeat(201) });
        const errors = await validate(dto);
        const aboutError = errors.find((error) => {
          return error.property === 'about';
        });

        expect(aboutError).toBeDefined();
      });

      it('accepts valid length when provided', async () => {
        const dto = validDto({ about: 'Valid about text' });
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });
    });

    describe('avatar', () => {
      it('rejects invalid URL when provided', async () => {
        const dto = validDto({ avatar: 'not-a-url' });
        const errors = await validate(dto);
        const avatarError = errors.find((error) => {
          return error.property === 'avatar';
        });

        expect(avatarError).toBeDefined();
      });

      it('accepts valid URL when provided', async () => {
        const dto = validDto({ avatar: 'https://example.com/avatar.png' });
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });
    });

    describe('email', () => {
      it('rejects empty', async () => {
        const dto = validDto({ email: '' });
        const errors = await validate(dto);
        const emailError = errors.find((error) => {
          return error.property === 'email';
        });

        expect(emailError).toBeDefined();
      });

      it('rejects invalid format', async () => {
        const dto = validDto({ email: 'invalid' });
        const errors = await validate(dto);
        const emailError = errors.find((error) => {
          return error.property === 'email';
        });

        expect(emailError).toBeDefined();
      });

      it('accepts valid email', async () => {
        const dto = validDto({ email: 'user@example.com' });
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });
    });

    describe('password', () => {
      it('rejects empty', async () => {
        const dto = validDto({ password: '' });
        const errors = await validate(dto);
        const passwordError = errors.find((error) => {
          return error.property === 'password';
        });

        expect(passwordError).toBeDefined();
      });

      it('rejects shorter than 6', async () => {
        const dto = validDto({ password: '12345' });
        const errors = await validate(dto);
        const passwordError = errors.find((error) => {
          return error.property === 'password';
        });

        expect(passwordError).toBeDefined();
      });

      it('accepts 6 characters', async () => {
        const dto = validDto({ password: '123456' });
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });
    });
  });
});
