import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { UserJwt } from 'src/auth/auth.interface';


export const RequestCompany = createParamDecorator(
  (data: keyof UserJwt, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserJwt | null = request.user;

    return data ? user?.[data] : user;
  },
);
