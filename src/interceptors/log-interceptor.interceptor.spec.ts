import { LogInterceptor } from './log-interceptor.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { createMock } from '@golevelup/ts-jest';
import { LogsService } from 'src/applogs/logs.service';

describe('LogInterceptor', () => {
  let interceptor: LogInterceptor;
  let reflector: Reflector;
  let logsService: LogsService;

  beforeEach(() => {
    reflector = createMock<Reflector>();
    logsService = createMock<LogsService>();
    interceptor = new LogInterceptor(reflector, logsService);
  });

  it('should create a log if NO_LOG_KEY is not set', async () => {
    const context = createMock<ExecutionContext>();
    const callHandler = {
      handle: jest.fn(() => of({ success: true })),
    };

    const mockRequest = {
      url: '/test-route',
      method: 'GET',
      body: { password: '1234', email: 'test@example.com' },
    };

    const mockResponse = {
      statusCode: 200,
    };

    (context.switchToHttp as any).mockReturnValue({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    await firstValueFrom(interceptor.intercept(context, callHandler as CallHandler));

    expect(logsService.createLog).toHaveBeenCalledWith({
      route: '/test-route',
      method: 'GET',
      body: { password: '1234', email: 'test@example.com' },
      response: { success: true },
      statusCode: 200,
      userId: null
    });
  });

  it('should skip log if NO_LOG_KEY is set', async () => {
    const context = createMock<ExecutionContext>();
    const callHandler = {
      handle: jest.fn(() => of({ success: true })),
    };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    await firstValueFrom(interceptor.intercept(context, callHandler as CallHandler));

    expect(logsService.createLog).not.toHaveBeenCalled();
  });

  it('should redact fields if SKIP_LOG_FIELDS is set', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          url: '/test-route',
          method: 'POST',
          body: { password: '1234', email: 'test@example.com' },
        }),
        getResponse: () => ({
          statusCode: 201,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    });

    const callHandler: CallHandler = {
      handle: () => of({ token: 'abcd', user: 'user1' }),
    };

    (reflector.getAllAndOverride as jest.Mock).mockImplementation(
      (key, targets) => {
        if (key === 'NO_LOG_KEY') return undefined;
        if (key === 'SKIP_LOG_FIELDS') {
          return {
            request: ['password'],
            response: ['token'],
          };
        }
      },
    );

    await firstValueFrom(interceptor.intercept(context, callHandler));

    expect(logsService.createLog).toHaveBeenCalledWith({
      route: '/test-route',
      method: 'POST',
      body: { password: '[REDACTED]', email: 'test@example.com' },
      response: { token: '[REDACTED]', user: 'user1' },
      statusCode: 201,
      userId: null
    });
  });
});
