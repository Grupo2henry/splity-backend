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
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { UserService } from './user.service';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/role.guard';
import { UUIDValidationPipe } from '../pipes/uuid.validation';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/response-user.dto';
import { REQUEST_USER_KEY } from '../auth/constants/auth.constants';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { User } from './entities/user.entity';

@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
export class UsuariosController {
  constructor(private readonly userService: UserService) {}
  @Roles(Role.Admin) // inyecta rol a la metadata
  @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get('usersAdmin')
  @ApiOperation({
    summary: 'Obtiene todos los usuarios con paginación y búsqueda por nombre',
  })
  @ApiOkResponse({
    description: 'Listado paginado de usuarios',
    schema: {
      example: {
        data: [
          {
            id: 'b3b0c750-b2aa-47a7-bf07-d2c7f2cfb8f5',
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            createdAt: '2024-04-27T12:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        lastPage: 1,
      },
    },
  })
  async getUsersByadmin(
    @Query('page') page = 1,
    @Query('limit') limit = 8,
    @Query('search') search = '',
  ): Promise<{ data: User[]; total: number; page: number; lastPage: number }> {
    try {
      return await this.userService.getUsersAdmin(page, limit, search);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // @SetMetadata('authType', 'None')
  //el decorador auth setea la metadata de auth para que el guardia global haga esta ruta publica
  //@Roles(Role.Admin)  inyecta rol a la metadata
  @UseGuards(AccessTokenGuard) // comprueba el rol requerido
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

  @Get('search/email')
  @ApiOperation({
    summary: 'Obtiene usuarios por coincidencia parcial de email',
  })
  @ApiOkResponse({
    description: 'Listado de usuarios que coinciden con el email',
    type: UserResponseDto,
    isArray: true,
  })
  findUsersByEmail(@Query('q') email: string) {
    console.log('Estoy en getUserByEmail');
    return this.userService.findUsersByEmail(email);
  }

  @Put('delete') //Se recomienda utilizar Patch
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

  @Roles(Role.Admin) // inyecta rol a la metadata
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
