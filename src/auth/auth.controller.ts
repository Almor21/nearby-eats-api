import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';
import { Public } from 'src/decorators/public.decorator';
import { Token } from 'src/decorators/token.decorator';
import { SkipLogFields } from 'src/decorators/skip-log-fields.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @SkipLogFields({
    request: ['password'],
    response: ['token'],
  })
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Post('logout')
  async logout(@Token() token: string) {
    return await this.authService.logout(token);
  }

  @Public()
  @Post('signup')
  async signup(@Body() data: SignUpDto) {
    return await this.authService.signUp(data);
  }
}
