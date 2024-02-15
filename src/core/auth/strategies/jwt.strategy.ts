import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { UsersRepository } from 'src/app/users/users.repository';
import { JwtI } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AT_SECRET'),
    });
  }

  async validate(payload: JwtI) {
    const user = await this.usersRepository.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { sub: payload.sub };
  }
}
