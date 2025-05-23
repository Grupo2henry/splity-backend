/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AccessTokenGuard } from './access-token.guard';
import { AuthType } from '../enums/auth-type.enum';
import { Reflector } from '@nestjs/core';
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AccessTokenGuard) // Corregido: paréntesis de cierre
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  // Set the default Auth Type (comentario corregido)
  private static readonly defaultAuthType = AuthType.Bearer;

  // Create authTypeGuardMap (comentario corregido)
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Print authTypeGuardMap (comentario corregido)
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()], // ve en la función y el método
    ) ?? [AuthenticationGuard.defaultAuthType]; // asigna el default sino encuentra, public

    // Show what are authTypes (comentario corregido)
    // console.log(authTypes);
    console.log('AuthTypes detected:', authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    // flat genera un único array (comentario corregido)
    // printeGuards => Show that the user can pass an array in users controller as well
    // console.log(guards);

    // Declare the default error (comentario corregido)
    let error = new UnauthorizedException();

    for (const instance of guards) {
      // print each instance (comentario corregido)
      // console.log(instance);
      // Decalre a new constant (comentario corregido)
      const canActivate = await Promise.resolve(
        // Here the AccessToken Guard Will be fired and check if user has permissions to access
        // Later Multiple AuthTypes can be used even if one of them returns true
        // The user is Authorised to access the resource
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      // Display Can Activate (comentario corregido)
      // console.log(canActivate);
      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
