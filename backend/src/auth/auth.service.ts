/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../user/dto/signin.user.dto';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly emailServie: MailsService,
  ) {}
  async signUpUser(credentials: CreateUserDto) {
    if (credentials.password !== credentials.confirm_password) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    const thereIsUser = await this.usersRepository.findOne({
      where: { email: credentials.email },
    });
    if (thereIsUser) {
      throw new HttpException(
        'El email ya está registrado',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const newUser = this.usersRepository.create({
      ...credentials,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(newUser);
    const { name, email } = savedUser;
    console.log(name, email);
    await this.emailServie.sendUserConfirmation({ name, email });
    return savedUser;
  }
  async signUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log("Este es user: ", user?.name);
    if (!user) {
      throw new HttpException('No matches found', 404);
    }
    if (!user.password) {
      throw new BadRequestException();
    }
    const isPasswordMatching = bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException(
        'wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.active) {
      throw new UnauthorizedException('User is not active');
    }
    console.log("Pase verificaciones primarias. Proto a generar token.");
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
    console.log("Este es el token: ", token)
    return { token };
  }
}
