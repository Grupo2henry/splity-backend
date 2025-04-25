/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserResponseDto } from '../user/dto/response.user.dto';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LoginUserDto } from '../user/dto/login.user.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { Request } from 'express';
import { REQUEST_USER_KEY } from './constants/auth.constants';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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
  @Post('logout')
  logout() {
    // No hace nada en el servidor. //falta implementación
    return { message: 'Logged out successfully' };
  }
  @Get('me')
  async getMe(@Req() request: Request) {
    /*{
      sub: '83062135-c40c-4c65-9890-79ff64bc9ae2',
      id: '83062135-c40c-4c65-9890-79ff64bc9ae2',
      email: 'gonzalo@example.com',
      is_premium: false,
      rol: 'user',
      iat: 1745587147,
      exp: 1745590747,
      aud: 'localhost:3000',
      iss: 'localhost:3000'
    }*/
    try {
      const userPayload = request[REQUEST_USER_KEY];
      if (!userPayload) {
        return { message: 'Usuario no autenticado' };
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
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
}
