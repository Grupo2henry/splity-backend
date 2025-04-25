import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/decorators/rol.decorator';
import { Rol } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/rol.guard';
// import { RolesGuard } from 'src/auth/guards/rol.guard';

@Controller('user')
export class UsuariosController {
  constructor(private readonly userService: UserService) {}
  @Roles(Rol.Admin) // inyecta rol a la metadata
  @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get()
  // @SetMetadata('authType', 'None')
  //el decorador auth setea la metadata de auth para que el guardia global haga esta ruta publica
  findAll() {
    return this.userService.findAll();
  }
}
