import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtI } from 'src/core/auth/interfaces/jwt.interface';

export const GetUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtI;
    return user?.sub;
  },
);
