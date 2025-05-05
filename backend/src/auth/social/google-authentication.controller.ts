import { Controller, Post, Body, Res } from '@nestjs/common';
import { GoogleTokenDto } from './providers/dtos/google-authentication.dto';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { Response } from 'express';
@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}
  @Post()
  public async authenticate(
    @Body() googleTokenDto: GoogleTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token =
      await this.googleAuthenticationService.authentication(googleTokenDto);
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // true si usás HTTPS (grok), false si usás localhost
      sameSite: 'lax', // permite el uso después de redirecciones como la de Mercado Pago
      maxAge: 3600000, // 1 hora
    });
    // res.cookie('authToken2', token, {
    //   httpOnly: false, // Necesario para poder leerla desde el frontend
    //   secure: process.env.NODE_ENV === 'production', // true en producción (Grok)
    //   sameSite: 'none', // ¡Cambia a 'none' para cross-domain!
    //   maxAge: 3600000,
    //   domain: '.grok.com', // O el dominio de tu túnel (¡importante!)
    // });
    return { access_token: token };
  }
}
