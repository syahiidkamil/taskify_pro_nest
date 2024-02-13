import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshJWTUserI } from 'src/core/auth/interfaces/refresh-jwt.interface';

export const GetJWTRefreshUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): RefreshJWTUserI | object => {
    const request = context.switchToHttp().getRequest();
    return request.user || {};
  },
);
