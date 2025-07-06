import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
