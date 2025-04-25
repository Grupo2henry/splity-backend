/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { Roles } from 'src/auth/decorators/rol.decorator';
// import { Rol } from 'src/auth/enums/role.enum';
// import { RolesGuard } from 'src/auth/guards/rol.guard';
import { UUIDValidationPipe } from 'src/pipes/uuid.validation';
import { UpdateUserDto } from './dto/update-user.dto';
// import { RolesGuard } from 'src/auth/guards/rol.guard';

@Controller('user')
export class UsuariosController {
  constructor(private readonly userService: UserService) {}
  // @SetMetadata('authType', 'None')
  //el decorador auth setea la metadata de auth para que el guardia global haga esta ruta publica
  // @Roles(Rol.Admin) // inyecta rol a la metadata
  // @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  async getUserById(@Param('id', UUIDValidationPipe) id: string) {
    const userFound = await this.userService.findOne(id);
    if (!userFound) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return userFound;
  }
  @Put(':id')
  async putUsers(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() user: UpdateUserDto,
  ) {
    const result = await this.userService.modifiedUser(id, user);
    return result;
  }
}
