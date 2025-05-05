/* eslint-disable prettier/prettier */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async generateToken(user: User) {
    if (!user) {
      console.log('falta user');
      throw new BadRequestException('No se pudo generar token ');
    }
    const token = await this.jwtService.signAsync(
      {
        //payload
        sub: user.id,
        id: user.id,
        email: user.email,
        is_premium: user.is_premium,
        role: user.role,
      },
      {
        //secrets
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    console.log('retornado del token de google:', {
      //payload
      sub: user.id,
      id: user.id,
      email: user.email,
      is_premium: user.is_premium,
      role: user.role,
    });
    return { token };
  }
}
