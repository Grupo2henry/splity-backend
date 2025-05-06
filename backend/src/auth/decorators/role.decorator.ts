/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { REQUIRED_ROLES_KEY } from '../constants/auth.constants';

export const Roles = (...roles: Role[]) =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);
