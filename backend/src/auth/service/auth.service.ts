/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException
} from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { MailsService } from 'src/mails/mails.service';
import { UserService } from 'src/user/user.service';
import { GenerateTokensProvider } from './generate-token.service';

@Injectable()
export class AuthService {
  constructor(

    private readonly userService: UserService,
    private readonly emailService: MailsService,
    private readonly generateTokensProvider: GenerateTokensProvider
  ) {}

  async signUpUser(credentials: CreateUserDto) {
    if (credentials.password !== credentials.confirm_password) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    const thereIsUser = await this.userService.findOneByEmail(credentials.email);

    if (thereIsUser) {
      throw new HttpException(
        'El email ya está registrado',
        HttpStatus.CONFLICT,
      );
    }

    const savedUser = await this.userService.createUserWithHashedPassword(credentials);
    
    const { name, email } = savedUser;
    try {
      await this.emailService.sendUserConfirmation({ name, email });
      console.log(`[AuthService] Correo de confirmación enviado a: ${email}`);
    } catch (error) {
      console.error(`[AuthService] Error al enviar el correo de confirmación a: ${email}`, error);
      throw new InternalServerErrorException('Error al enviar el correo de confirmación.');
    }
    return savedUser;
  }

  async signUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      throw new HttpException('No matches found', 404);
    }
    if (!user.password) {
      throw new BadRequestException();
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException(
        'wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.active) {
      throw new UnauthorizedException('User is not active');
    }
    console.log("Pase verificaciones primarias. Pronto a generar token.");

    const token = await this.generateTokensProvider.generateToken(user); // 👈 Usa el servicio para generar el token

    console.log("Este es el token: ", token);
    return { token };
  }
}
