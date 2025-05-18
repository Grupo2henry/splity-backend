/* eslint-disable prettier/prettier */
// src/group/controller/group.controller.ts
import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GroupService } from '../services/group.service';
import { GroupMembershipService } from '../services/group-membership.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { UserService } from 'src/user/user.service';
import { Group } from '../entities/group.entity';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { RequestWithUser } from 'src/types/request-with-user';
import { REQUEST_USER_KEY } from '../../auth/constants/auth.constants';
import { GroupResponseDto } from '../dto/group-response.dto';
import { GroupLimit } from '../decorators/group-limit.decorator';
import { GroupLimitGuard } from '../guards/group-limit.guard';
import { IsGroupMemberGuard } from '../guards/is-group-member.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/enums/role.enum';

@ApiBearerAuth()
@Controller()
@ApiTags('Groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupMembershipService: GroupMembershipService,
    private readonly userService: UserService,
  ) {}

  @Post('groups')
  @ApiOperation({
    summary: 'Crea un grupo/evento nuevo con un listado de participantes',
  })
  @ApiOkResponse({
    description: 'Grupo creado nuevamente',
    schema: {
      example: {
        name: 'Nuevo Grupo de Amigos',
        participants: [
          '9c144b66-9dc9-4df1-ba78-f3b44b1a982d',
          '14e8bb7f-a2c1-4f03-b244-635f970547ce',
          '40586790-bca4-4e0b-b88b-2f104594337c',
        ],
        emoji: '🎉',
      },
    },
  })
  @UseGuards(AccessTokenGuard, GroupLimitGuard) // ✅ orden correcto y guard apilado
  @GroupLimit(3)
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() request: RequestWithUser,
  ): Promise<Group> {
    console.log('Estoy en group, pase el Guard.');
    const user = request[REQUEST_USER_KEY];
    if (!user) {
      throw new Error('User not found in request.');
    }
    return await this.groupService.createGroupWithParticipants(
      createGroupDto,
      user.id,
    );
  }

  @Get('groups')
  @ApiOperation({
    summary: 'Devuelve todos los grupos en la base de datos',
  })
  @ApiOkResponse({
    description: 'Grupos registrados',
    schema: {
      example: {
        creatorId: 'd8a7382c-bb90-4e83-8882-c7486c9b279d',
        name: 'Nuevo Grupo de Amigos',
        participants: [
          '9c144b66-9dc9-4df1-ba78-f3b44b1a982d',
          '14e8bb7f-a2c1-4f03-b244-635f970547ce',
          '40586790-bca4-4e0b-b88b-2f104594337c',
        ],
      },
    },
  })
  async findAll() {
    return this.groupService.findAll();
  }
  //Agregar Guard aquí para rechazar petición si el user no está en el grupo
  @Get('groups/id/:id')
  @UseGuards(AccessTokenGuard, IsGroupMemberGuard)
  @ApiOperation({
    summary: 'Devuelve el grupo segun la id',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(id);
  }

  @Get('users/me/groups/created') //Arreglar, comportamiento indeseado
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: 'Devuelve todos los grupos creados por el usuario logueado',
  })
  @ApiOkResponse({
    description: 'Listado de grupos creados por el usuario',
    type: [GroupResponseDto],
  })
  async findCreatedGroups(
    @Req() request: RequestWithUser,
  ): Promise<GroupResponseDto[]> {
    const user = request[REQUEST_USER_KEY];
    if (!user) {
      throw new Error('User not found in request.');
    }
    const createdGroups = await this.groupService.findGroupsCreatedByUser(
      user.id,
    );
    return createdGroups.map((group) => new GroupResponseDto(group));
  }

  @Patch('groups/id/:id/update')
  @UseGuards(AccessTokenGuard, IsGroupMemberGuard)
  @ApiOperation({
    summary: 'Actualiza el grupo segun la id',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Patch('groups/id/:id/deactivate') // Endpoint que denota un borrado lógico
  @ApiOperation({
    summary: 'Realiza un borrado lógico del grupo según su ID',
    description: 'Modifica la propiedad "active" del grupo a false.',
  })
  @ApiOkResponse({
    description: 'Grupo desactivado exitosamente',
    type: GroupResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el grupo con el ID proporcionado',
  })
  @ApiUnauthorizedResponse({ description: 'Usuario no autorizado' }) // Puedes personalizar esto según tu lógica de autorización
  @HttpCode(HttpStatus.OK) // Indica que la operación fue exitosa (aunque no se esté "creando" nada)
  async softDeleteGroup(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GroupResponseDto> {
    const updatedGroup = await this.groupService.softDelete(id);
    if (!updatedGroup) {
      throw new NotFoundException(`No se encontró el grupo con el ID: ${id}`);
    }
    return new GroupResponseDto(updatedGroup);
  }

  //Solo debería acceder super admin, agregar Guard.
  @Delete('groups/id/:id')
  @ApiOperation({
    summary: 'Elimina el grupo segun la id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.groupService.remove(id);
  }
  @Roles(Role.Admin) // inyecta rol a la metadata
  @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get('DetailsOfGroup/:id')
  async detailsOfGroup(@Param('id') id: string) {
    const group = await this.groupService.findOneAdmin(+id);
    return group;
  }
}
