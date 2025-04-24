import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly userService: UserService) {}
  @Get()
  // @SetMetadata('authType', 'None')
  //el decorador auth setea la metadata de auth para que el guardia global haga esta ruta publica
  @Auth(AuthType.None)
  findAll() {
    return this.userService.findAll();
  }
}
