import { Body, Controller, Post, UseGuards, HttpCode } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { GetUserId } from 'src/common/get-user-id.decorator';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh-token.guard';
import { GetJWTRefreshUser } from 'src/common/get-jwt-refresh-user.decorator';
import { RefreshJWTUserI } from './interfaces/refresh-jwt.interface';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LogoutResponseDto } from './dtos/logout-response.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { RefreshResponseDto } from './dtos/refresh-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'success',
    type: RegisterResponseDto,
  })
  @ApiBody({ type: RegisterDto, description: 'Registration data' })
  async register(
    @Body() createUserDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate user and retrieve tokens' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiBody({ type: LoginDto, description: 'User login credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log the user out' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  logout(@GetUserId() userId: string): Promise<LogoutResponseDto> {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Refresh the access and refresh tokens using the provided refresh token',
    description:
      'The refresh_token should be sent as a Bearer token in the Authorization header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: RefreshResponseDto,
  })
  @ApiBearerAuth('refresh_token')
  async refreshTokens(
    @GetJWTRefreshUser() { sub, refresh_token }: RefreshJWTUserI,
  ): Promise<RefreshResponseDto> {
    return this.authService.refreshToken(sub, refresh_token);
  }
}
