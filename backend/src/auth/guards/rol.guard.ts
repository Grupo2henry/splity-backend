/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Rol } from '../enums/role.enum';
import {
  REQUEST_USER_KEY,
  REQUIRED_ROLES_KEY,
} from '../constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(
      REQUIRED_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    // 2. Obtener usuario de la request (inyectado por AuthGuard)
    const request = context.switchToHttp().getRequest();
    console.log(request[REQUEST_USER_KEY]);
    const user = request[REQUEST_USER_KEY];
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRequiredRole = requiredRoles.some((role) =>
      user?.rol?.includes(role),
    );
    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Required roles: ${requiredRoles.join(', ')}. Your roles: ${request[REQUEST_USER_KEY].rol}`,
      );
    }
    return true;
  }
}
