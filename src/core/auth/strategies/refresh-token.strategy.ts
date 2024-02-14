import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { JwtI } from '../interfaces/jwt.interface';
import { RefreshJWTUserI } from '../interfaces/refresh-jwt.interface';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtI): Promise<RefreshJWTUserI> {
    const { headers } = request;
    const { sub } = payload;
    const authHeader = headers['authorization'] || headers['Authorization'];

    const refresh_token = authHeader && authHeader.split(' ')[1];
    return { sub, refresh_token };
  }
}
