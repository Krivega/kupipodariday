import { AuthLocalGuard } from '../auth.guard';

describe('AuthLocalGuard', () => {
  it('should be defined', () => {
    expect(new AuthLocalGuard()).toBeDefined();
  });
});
