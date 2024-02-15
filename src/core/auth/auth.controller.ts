import { Body, Controller, Post, UseGuards, HttpCode } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { GetUserId } from 'src/common/get-user-id.decorator';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh-token.guard';
import { GetJWTRefreshUser } from 'src/common/get-jwt-refresh-user.decorator';
import { RefreshJWTUserI } from './interfaces/refresh-jwt.interface';
import { TokensI } from './interfaces/tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  logout(@GetUserId() userId: string): Promise<string> {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @HttpCode(200)
  refreshTokens(
    @GetJWTRefreshUser() { sub, refresh_token }: RefreshJWTUserI,
  ): Promise<TokensI> {
    return this.authService.refreshToken(sub, refresh_token);
  }
}
