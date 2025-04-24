/* eslint-disable prettier/prettier */
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserResponseDto } from '../user/dto/response.user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from '../user/dto/login.user.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
}
