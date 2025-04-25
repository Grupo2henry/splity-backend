import { SetMetadata } from '@nestjs/common';
import { Rol } from '../enums/role.enum';
import { REQUIRED_ROLES_KEY } from '../constants/auth.constants';

export const Roles = (...roles: Rol[]) =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);
