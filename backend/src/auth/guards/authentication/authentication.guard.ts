/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/*
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';
import { AccesTokenGuard } from '../acces-token.guards.ts/acces-token.guards.ts.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';

import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AccesTokenGuard) //s
    private readonly accessTokenGuard: AccesTokenGuard,
    ///@InjectCache() // 👈 Inyectar Redis
    private cacheManager: Cache,
  ) {}

  // Set the default Auth Type
  private static readonly defaultAuthType = AuthType.Bearer;

  // Create authTypeGuardMap
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Print authTypeGuardMap
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()], // ve en el la funcion y el metodo
    ) ?? [AuthenticationGuard.defaultAuthType]; // asigna el default sino encuentra, public
    // Show what are authTypes
    // console.log(authTypes);
    console.log('AuthTypes detected:', authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    //flat genera un unico array
    // printeGuards => Show that the user can pass an array in users controller as well
    // console.log(guards);

    // Declare the default error
    let error = new UnauthorizedException();

    for (const instance of guards) {
      // print each instance
      // console.log(instance);
      // Decalre a new constant
      const canActivate = await Promise.resolve(
        // Here the AccessToken Guard Will be fired and check if user has permissions to acces
        // Later Multiple AuthTypes can be used even if one of them returns true
        // The user is Authorised to access the resource
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      // Display Can Activate
      // console.log(canActivate);
      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
*/