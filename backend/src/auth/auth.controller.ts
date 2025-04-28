/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserResponseDto } from '../user/dto/response.user.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto } from '../user/dto/login.user.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { Request } from 'express';
import { REQUEST_USER_KEY } from './constants/auth.constants';
import { UserService } from '../user/user.service';
import { AccesTokenGuard } from './guards/acces-token.guard/acces-tokene.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  @Auth(AuthType.None)
  @Post('signup')
  // @UseInterceptors(DateAdderInterceptor)
  async postUsers(@Body() user: CreateUserDto) {
    const newUser = await this.authService.signUpUser(user);
    return new UserResponseDto(newUser);
  }
  @Auth(AuthType.None)
  @Post('signin')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    return this.authService.signUser(email, password);
  }
  @Get('me')
  @UseGuards(AccesTokenGuard) // esto después de que se implemente global se borra
  async getMe(@Req() request: Request) {
    try {
      const userPayload = request[REQUEST_USER_KEY];
      if (!userPayload) {
        return { message: 'Usuario no autenticado' };
      }
      const user = await this.userService.findOne(userPayload.id);
      if (!user) {
        return { message: 'Usuario no encontrado' };
      }
      return new UserResponseDto(user);
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
      return { message: 'Error interno del servidor' };
    }
  }

  @Post('logout')
  @UseGuards(AccesTokenGuard)
  logout(/*@Req() request: Request*/) {
    // const token = this.extractTokenFromHeader(request);

    // if (!token) {
    //   throw new UnauthorizedException('Token no encontrado');
    // }

    // // Guarda el token en caché (en memoria)
    // await this.cacheManager.set(`blacklist:${token}`, 'revoked');

    return { message: 'Logged out successfully' };
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
