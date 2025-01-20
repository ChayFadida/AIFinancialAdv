import { Request } from 'express';

import { UserType } from '../../user/models';

export interface AuthRequest extends Request {
  user: UserType;
}

export interface RegisterUserRequestType extends Request {
  body: Omit<UserType, '_id' | 'role'> & { password: string };
}

export interface LoginRequestType extends Request {
  body: { email: UserType['email']; password: string };
}

export interface LoginByTokenRequestType extends AuthRequest {
  token: string;
}
