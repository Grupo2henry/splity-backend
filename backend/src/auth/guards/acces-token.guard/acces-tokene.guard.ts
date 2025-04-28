/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import jwtConfig from '../../../config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AccesTokenGuard implements CanActivate {
  constructor(
    //injecto servicio
    private readonly jwtService: JwtService,
    //configuraciones
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractRequestFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    const isRevoked = await this.cacheManager.get(`blacklist:${token}`);
    if (isRevoked === 'revoked') {
      throw new UnauthorizedException('Token revocado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      //inyecta payload del token va a estar en la variable [REQUEST_USER_KEY]
      request[REQUEST_USER_KEY] = payload;
      console.log(payload);
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
