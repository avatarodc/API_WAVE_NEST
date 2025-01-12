import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
  
  

  @Post('login')
  async login(@Body() body: { telephone: string; pin: string }) {
    return this.authService.login(body.telephone, body.pin);
  }
}
