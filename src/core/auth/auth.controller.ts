import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { GetUserId } from 'src/common/get-user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Post('logout')
  logout(@GetUserId() userId: string): Promise<string> {
    return this.authService.logout(userId);
  }
}
