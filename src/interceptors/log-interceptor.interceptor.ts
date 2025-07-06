import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs';
import { LogsService } from 'src/applogs/logs.service';
import { NO_LOG_KEY } from 'src/decorators/nolog.decorator';
import { SKIP_LOG_FIELDS } from 'src/decorators/skip-log-fields.decorator';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly logService: LogsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap((responseBody) => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const noLog = this.reflector.getAllAndOverride(NO_LOG_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

        if (noLog) {
          return;
        }

        const skipLogFields = this.reflector.getAllAndOverride(
          SKIP_LOG_FIELDS,
          [context.getHandler(), context.getClass()],
        );

        const requestData = { ...request.body };
        let responseData = { ...responseBody };

        const { request: skipRequestFields, response: skipResponseFields } =
          skipLogFields || {};

        if (skipRequestFields) {
          skipRequestFields.forEach((field) => requestData[field] = '[REDACTED]');
        }
        if (skipResponseFields) {
          skipResponseFields.forEach((field) => responseData[field] = '[REDACTED]');
        }

        const logData = {
          userId: request.user ? request.user.id : null,
          route: request.url,
          method: request.method,
          body: requestData,
          response: responseData,
          statusCode: response.statusCode,
        };

        return this.logService.createLog(logData);
      }),
    );
  }
}
