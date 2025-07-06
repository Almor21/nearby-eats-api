import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtGuard } from './auth/guards/jwt/jwt.guard';
import { IntegratorModule } from './integrator/integrator.module';
import { PlacesModule } from './places/places.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LogInterceptor } from './interceptors/log-interceptor.interceptor';
import { LogsModule } from './applogs/logs.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    IntegratorModule,
    PlacesModule,
    LogsModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 30,
      },
    ]),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
