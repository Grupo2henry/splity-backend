/* eslint-disable prettier/prettier */
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { REQUEST_USER_KEY } from '../auth/constants/auth.constants';

export interface RequestWithUser extends Request {
  [REQUEST_USER_KEY]: User;
}