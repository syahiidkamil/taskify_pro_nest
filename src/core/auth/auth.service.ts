import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersRepository } from 'src/app/users/users.repository';
import { RegisterDto } from './dtos/register.dto';
import { ConfigService } from '@nestjs/config';
import { JwtI } from './interfaces/jwt.interface';
import { TokensI } from './interfaces/tokens.interface';
import { TasksService } from 'src/app/tasks/tasks.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private tasksService: TasksService,
  ) {}

  async register(createUserDto: RegisterDto) {
    const { password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      this.insertInitialTasks(user.id);

      return 'success';
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw new Error(error.message);
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = await this.getTokens(user.id, user.email);
      this.updateHashedRT(user.id, tokens);

      return tokens;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async updateHashedRT(userId: string, tokens): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedRT = await bcrypt.hash(tokens?.refresh_token, salt);
    await this.usersRepository.updateUserById(userId, {
      hashedRT,
    });
  }

  async logout(userId: string): Promise<string> {
    await this.usersRepository.updateUserWithHashById(userId, {
      hashedRT: null,
    });

    return 'Successfully logged out';
  }

  async refreshToken(userId: string, refreshToken: string): Promise<TokensI> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user || !user?.hashedRT)
      throw new UnauthorizedException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRT,
    );
    if (!refreshTokenMatches) throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersRepository.updateUserById(userId, {
      hashedRT: tokens?.refresh_token,
    });

    return tokens;
  }

  async getTokens(userId: string, email: string): Promise<any> {
    const jwtPayload: JwtI = {
      sub: userId,
      email: email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: this.configService.get<string>('AT_EXPIRATION_TIME'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: this.configService.get<string>('RT_EXPIRATION_TIME'),
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private async insertInitialTasks(userId: string): Promise<void> {
    this.tasksService.create(userId, {
      title: 'Revamp the task page UI',
      description: 'Update the UI to be more user-friendly.',
      priority: 1,
    });
    this.tasksService.create(userId, {
      title: 'Implement state management',
      description: 'Set up state management for the app.',
      priority: 2,
    });
  }
}
