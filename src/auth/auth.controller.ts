import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Public()
  @Post('signup')
  async signup(@Body() data: SignUpDto) {
    return await this.authService.signUp(data);
  }
}
