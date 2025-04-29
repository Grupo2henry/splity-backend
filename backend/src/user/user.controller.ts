/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { Roles } from '../auth/decorators/rol.decorator';
import { Rol } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/rol.guard';
import { UUIDValidationPipe } from '../pipes/uuid.validation';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/response.user.dto';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
@Controller('users')
@ApiTags('Users')
export class UsuariosController {
  constructor(private readonly userService: UserService) {}

  // @SetMetadata('authType', 'None')
  //el decorador auth setea la metadata de auth para que el guardia global haga esta ruta publica
  @Roles(Rol.Admin) // inyecta rol a la metadata
  @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get()
  @ApiOperation({
    summary: 'Obtiene todos los usuario, solo lo puede hacer el administrador',
  })
  @ApiOkResponse({
    description: 'Listado de usuarios',
    type: UserResponseDto,
    isArray: true,
  })
  findAll() {
    return this.userService.findAll();
  }
  @Put('delete')
  @ApiOperation({
    summary: 'Cambia is active del propio usuario a false',
  })
  @ApiOkResponse({
    description: 'Usuario desactivado exitosamente',
    schema: {
      example: {
        id: 'b3b0c750-b2aa-47a7-bf07-d2c7f2cfb8f5',
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        created_at: '2024-04-27T12:00:00.000Z',
        active: false,
      },
    },
  })
  async delete(@Req() request: Request) {
    try {
      const userPayload = request[REQUEST_USER_KEY];
      if (!userPayload) {
        return { message: 'Usuario no autenticado' };
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const user = await this.userService.desactivateUser(userPayload.sub);
      return new UserResponseDto(user);
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
      return { message: 'Error interno del servidor' };
    }
  }
  @Roles(Rol.Admin) // inyecta rol a la metadata
  @UseGuards(RolesGuard) // comprueba el rol requerido
  @Put('admin/:id')
  @ApiOperation({
    summary: 'Cambia is active del usuario a false',
  })
  @ApiOkResponse({
    description: 'Usuario desactivado exitosamente',
    schema: {
      example: {
        id: 'b3b0c750-b2aa-47a7-bf07-d2c7f2cfb8f5',
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        created_at: '2024-04-27T12:00:00.000Z',
        active: false,
      },
    },
  })
  async putUsersAdmin(@Param('id', UUIDValidationPipe) id: string) {
    const result = await this.userService.desactivateUser(id);
    return result;
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene usuario por id',
  })
  @ApiOkResponse({
    description: 'Usuario sin relaciones',
    type: UserResponseDto,
  })
  async getUserById(@Param('id', UUIDValidationPipe) id: string) {
    const userFound = await this.userService.findOne(id);
    if (!userFound) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return userFound;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Modifica usuario por su id',
  })
  @ApiOkResponse({
    description: 'Usuario sin relaciones',
    type: UserResponseDto,
  })
  async putUsers(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() user: UpdateUserDto,
  ) {
    const result = await this.userService.modifiedUser(id, user);
    return result;
  }
}
