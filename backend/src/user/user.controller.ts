import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/rol.decorator';
import { Rol } from 'src/auth/enums/role.enum';
// import { RolesGuard } from 'src/auth/guards/rol.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly userService: UserService) {}
  @Roles(Rol.Admin)
  @Get()
  // @SetMetadata('authType', 'None')
  //el decorador auth setea la metadata de auth para que el guardia global haga esta ruta publica
  @Auth(AuthType.None)
  findAll() {
    return this.userService.findAll();
  }
  // @Get('admin')
  // @Roles(Rol.Admin)
  // @UseGuards(RolesGuard)
  // getAdminData() {
  //   return 'Sólo admins pueden ver esto';
  // }
}
