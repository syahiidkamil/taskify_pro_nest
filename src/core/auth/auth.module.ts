import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from 'src/app/users/users.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-token.strategy';
import { TasksService } from 'src/app/tasks/tasks.service';
import { TasksModule } from 'src/app/tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('AT_EXPIRATION_TIME') || '60m',
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    UsersRepository,
    JwtStrategy,
    RefreshJwtStrategy,
    TasksService,
  ],
  controllers: [AuthController],
  exports: [PassportModule],
})
export class AuthModule {}
