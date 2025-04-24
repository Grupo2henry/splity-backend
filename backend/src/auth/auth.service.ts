/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../user/dto/login.user.dto';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async signUpUser(credentials: CreateUserDto) {
    if (credentials.password !== credentials.confirm_password) {
      console.log(credentials.password);
      console.log(credentials.confirm_password);
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
    return savedUser;
  }
  async signUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('No matches found', 404);
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException(
        'wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // const userPayload = {
    // sub: user.id,
    // id: user.id,
    // email: user.email,
    // is_premium: user.is_premium,
    // };
    // console.log('payload', userPayload);
    const token = await this.jwtService.signAsync(
      {
        //payload
        sub: user.id,
        id: user.id,
        email: user.email,
        is_premium: user.is_premium,
        rol: user.rol,
      },
      {
        //secrets
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.accesTokenTtl,
      },
    );
    return { token };
  }
}
