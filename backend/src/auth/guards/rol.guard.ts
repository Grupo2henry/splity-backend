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
import { REQUEST_USER_KEY } from '../constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>('rol', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    //en el authguar en req inyectamos el user, ahora lo leemos.
    const user = request[REQUEST_USER_KEY];
    const hasRole = () =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      requiredRoles.some((role) => user?.rol?.includes(role));
    const valid = user && user.roles && hasRole();
    if (!valid) {
      throw new ForbiddenException(
        'You do not have permission to acces this route',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return valid;
  }
}
