import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt.payload.type.js';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator(
    (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
        const user = request.user as JwtPayload;
        return field ? user?.[field] : user;
    },
);