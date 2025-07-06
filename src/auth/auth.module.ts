import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token/token.service';
import { JwtCleanupService } from './token/jwt-cleanup.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtCleanupService, JwtService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
