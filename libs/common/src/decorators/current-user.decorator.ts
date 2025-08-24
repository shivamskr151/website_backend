import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserPayload } from '../interfaces/user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof IUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
