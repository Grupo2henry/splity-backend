import { SetMetadata } from '@nestjs/common';
import { Rol } from '../enums/role.enum';
import { ROL_USER_KEY } from '../constants/auth.constants';

export const Roles = (...roles: Rol[]) => SetMetadata(ROL_USER_KEY, roles);
