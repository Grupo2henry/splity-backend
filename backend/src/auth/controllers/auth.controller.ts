/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../../user/dto/create.user.dto';
import { UserResponseDto } from '../../user/dto/response.user.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  HttpStatus
} from '@nestjs/common';
import { LoginUserDto } from '../../user/dto/signin.user.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { UserService } from '../../user/user.service';
import { AccessTokenGuard } from '../guards/access-token.guard/access-token.guard';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Auth(AuthType.None)
  @Post('register')
  @ApiOperation({ summary: 'Registra usuarios en la app' })
  @ApiCreatedResponse({
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  // @UseInterceptors(DateAdderInterceptor)
  async postUsers(@Body() user: CreateUserDto) {
    const newUser = await this.authService.signUpUser(user);
    return new UserResponseDto(newUser);
  }

  @Auth(AuthType.None)
  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión de usuarios en la app' })
  @ApiCreatedResponse({
    description: 'Token creado exitosamente',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async signIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const { email, password } = loginUserDto;
    const { token } = await this.authService.signUser(email, password);
    console.log("Token obtenido del servicio: ", token)
    return res.status(HttpStatus.OK).json({ access_token: token });
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtiene a usuario actual' })
  @UseGuards(AccessTokenGuard) // esto después de que se implemente global se borra
  @ApiOkResponse({
    description: 'Usuario actual',
    type: UserResponseDto,
  })
  async getMe(@Req() request: Request) {
    try {
      const userPayload = request[REQUEST_USER_KEY];
      if (!userPayload) {
        return { message: 'Usuario no autenticado' };
      }
      const user = await this.userService.findUserGroups(userPayload.id);
      if (!user) {
        return { message: 'Usuario no encontrado' };
      }
      return { user };
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
      return { message: 'Error interno del servidor' };
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Deslogea usuario' })
  @ApiCreatedResponse({
    description: 'Deslogeado de usuario',
    schema: {
      example: {
        message: 'Logged out successfully',
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  logout(@Req() request: Request) {
    return { message: 'Logged out successfully' };
  }
  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [_, token] = request.headers.authorization?.split(' ') ?? [];
  //   return token;
  // }
}
