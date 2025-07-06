import { JwtGuard } from './jwt.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createMock } from '@golevelup/ts-jest';

describe('JwtGuard', () => {
  let jwtGuard: JwtGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = createMock<Reflector>();
    jwtGuard = new JwtGuard(reflector);
  });

  it('must allow access if the route is public (@Public)', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);

    const mockContext = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      getClass: jest.fn(),
    });

    const result = jwtGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('must delegate to AuthGuard if the route is not public', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

    const canActivateSpy = jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate')
      .mockReturnValue(true);

    const mockContext = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      getClass: jest.fn(),
    });

    const result = jwtGuard.canActivate(mockContext);
    expect(canActivateSpy).toHaveBeenCalledWith(mockContext);
    expect(result).toBe(true);
  });
});
