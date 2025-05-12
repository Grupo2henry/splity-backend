/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../../config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-authentication.dto';
import { UserService } from '../../user/user.service';
import { GenerateTokensProvider } from './generate-token.service';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthclient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtconfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly generateTokensprovider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtconfiguration.googleClientId;
    const clientSecret = this.jwtconfiguration.googleClientSecret;
    this.oauthclient = new OAuth2Client(clientId, clientSecret);
  }
  public async authentication(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthclient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      const payload = loginTicket.getPayload();
      if (!payload) throw new Error('Token inválido');
      const { email, sub: googleId, name, given_name: username, picture: profile_picture_url } = payload;

      if (!email || !name || !username || !profile_picture_url) {
        throw new BadRequestException('El token de Google no contiene información necesaria');
      }
      let user = await this.userService.findOneByEmail(email);

      if (user) {
        if (!user.google_id) {
          await this.userService.update(user.id, { googleId: googleId, profile_picture_url: profile_picture_url });
          user = await this.userService.findOneByEmail(email);
        }
        if (user) {
          return this.generateTokensprovider.generateToken(user);
        } else {
          throw new UnauthorizedException('No se pudo encontrar o vincular la cuenta de usuario.');
        }
      } else {
        const newUser = await this.userService.createGoogleUser({
          email: email,
          name: name,
          username: `${username.toLowerCase()}${Math.floor(Math.random() * 10000)}`,
          googleId: googleId,
          profile_picture_url: profile_picture_url,
        });
        return this.generateTokensprovider.generateToken(newUser);
      }

    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}