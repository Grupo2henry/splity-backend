/* eslint-disable prettier/prettier */
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AuthType } from '../enums/auth-type.enum';
import { SetMetadata } from '@nestjs/common';
//define el tipo de auth requerida para la ruta que después se va a usar con el authenticationguard y el accestokenguard
export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
