import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../../auth/types/active-user-data.interface';

export const CurrentUser = createParamDecorator((data: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as ActiveUserData | undefined;

  if (!data) {
    return user;
  }

  return user?.[data];
});
