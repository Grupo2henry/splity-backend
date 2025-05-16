/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  NotFoundException,
  UseGuards,
  Req,
  Query,
  HttpException,
  DefaultValuePipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { GetGroupsDto } from '../dto/get-groups.dto';
import { GroupMembershipService } from '../services/group-membership.service';
import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
// import { GroupMembershipResponseDto } from '../dto/group-membership-response.dto';
import { GroupResponseDto } from '../dto/group-response.dto';
import { UserService } from '../../user/user.service';
import { GroupService } from '../services/group.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { REQUEST_USER_KEY } from '../../auth/constants/auth.constants';
import { RequestWithUser } from '../../types/request-with-user';
import { GroupRole } from '../enums/group-role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  // ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/enums/role.enum';
// import { UpdateMembersDto } from '../dto/update-member.dto';

@ApiBearerAuth()
@Controller()
@ApiTags('GroupsMemberships')
export class GroupMembershipController {
  constructor(
    private readonly groupMembershipService: GroupMembershipService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  @Post('groups/memberships')
  @ApiOperation({
    summary: 'Registra una membersia de un usuario registrado a un grupo',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGroupMembershipDto: CreateGroupMembershipDto) {
    const user = await this.userService.findOne(
      createGroupMembershipDto.userId,
    );
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const group = await this.groupService.findOne(
      createGroupMembershipDto.groupId,
    );
    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }

    const existingMembership =
      await this.groupMembershipService.findByUserAndGroup(
        createGroupMembershipDto.userId,
        createGroupMembershipDto.groupId,
      );

    if (existingMembership) {
      throw new Error('El usuario ya es miembro del grupo.');
    }

    const membership = await this.groupMembershipService.create(
      createGroupMembershipDto,
      user,
      group,
    );

    return {
      message: 'Membresía creada exitosamente',
      membership,
    };
  }
  @Roles(Role.Admin) // inyecta rol a la metadata
  @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get('AdminMembershipsUser/:userId')
  async getGroups(
    @Param('userId') userId: string,
    @Query() query: GetGroupsDto,
  ) {
    return this.groupMembershipService.getGroups(userId, query);
  }
  @Get('groups/memberships')
  @ApiOperation({
    summary: 'Devuelve todas las membresias de grupos registradas',
  })
  async findAll() {
    console.log('Estoy en group/membership');
    return this.groupMembershipService.findAll();
  }

  @Get('groups/memberships/id/:id')
  @ApiOperation({
    summary: 'Devuelve la membresias de grupos segun id del parametro',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('Estoy en group/membership/:id');
    return this.groupMembershipService.findOne(id);
  }

  @Put('groups/memberships/id/:id')
  @ApiOperation({
    summary: 'Actualiza la membresias de grupos segun id del parametro',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupMembershipDto: UpdateGroupMembershipDto,
  ) {
    return this.groupMembershipService.update(id, updateGroupMembershipDto);
  }

  @Get('groups/my-groups')
  @ApiOperation({
    summary:
      'Devuelve todos los grupos a los que pertenezca el usuario logueado',
  })
  @UseGuards(AccessTokenGuard)
  async findGroupsByUser(@Req() request: RequestWithUser) {
    console.log('Estoy en membership, pase el Guard.');
    const user = request[REQUEST_USER_KEY];
    if (!user) {
      throw new Error('User not found in request.');
    }
    return this.groupMembershipService.findGroupsByUser(user.id);
  }

  @Get('users/me/groups/')
  @ApiOperation({
    summary:
      'Devuelve los grupos del usuario logueado filtrados por su rol (query parameter)',
  })
  @ApiQuery({
    name: 'role',
    enum: GroupRole,
    description: 'Filtrar grupos por el rol del usuario (ADMIN o MEMBER)',
    required: false, // O true si siempre quieres filtrar por rol
  })
  @ApiOkResponse({
    description: 'Listado de grupos filtrados por el rol del usuario',
    type: [GroupResponseDto],
  })
  // @UseGuards(AccessTokenGuard)
  // async findGroupsByUserRoleQuery(
  //   @Req() request: RequestWithUser,
  //   @Query('role') role?: GroupRole,
  // ): Promise<GroupResponseDto[]> {
  //   const user = request[REQUEST_USER_KEY];
  //   if (!user) {
  //     throw new Error('User not found in request.');
  //   }
  //   if (role) {
  //     const memberships = await this.groupMembershipService.findGroupsByUserAndRole(user.id, role);
  //     return memberships.map(membership => new GroupResponseDto(membership.group));
  //   } else {
  //     // Si no se proporciona el rol, podrías devolver todos los grupos del usuario
  //     const memberships = await this.groupMembershipService.findGroupsByUser(user.id);
  //     return memberships.map(membership => new GroupResponseDto(membership.group));
  //   }
  // }
  @Get('groups/:groupId/members')
  @ApiOperation({
    summary: 'Devuelve todos los miembros de un grupos segun id del parametro',
  })
  async findMembersByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupMembershipService.findMembersByGroup(groupId);
  }

  @Get('groups/:groupId/members/:userId')
  @ApiOperation({
    summary:
      'Devuelve un miembro de un grupos segun id del grupo y del usuario en el parametro',
  })
  async findByUserAndGroup(
    @Param('userId') userId: string,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.groupMembershipService.findByUserAndGroup(userId, groupId);
  }

  // @Patch('groups/memberships/id/:id/deactivate') // 👈 Nuevo endpoint para la desactivación lógica
  // @ApiOperation({
  //   summary: 'Desactiva una membresía de grupo (borrado lógico)',
  //   description: 'Modifica la propiedad "active" de la membresía a false.',
  // })
  // @ApiOkResponse({
  //   description: 'Membresía de grupo desactivada exitosamente',
  //   type: GroupMembershipResponseDto,
  // })
  // @ApiNotFoundResponse({
  //   description: 'No se encontró la membresía con el ID proporcionado',
  // })
  // @HttpCode(HttpStatus.OK)
  // async deactivateMembership(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<GroupMembershipResponseDto> {
  //   const deactivatedMembership =
  //     await this.groupMembershipService.deactivate(id);
  //   if (!deactivatedMembership) {
  //     throw new NotFoundException(
  //       `No se encontró la membresía con el ID: ${id}`,
  //     );
  //   }
  //   return new GroupMembershipResponseDto(deactivatedMembership);
  // }

  @Delete('groups/memberships/id/:id') //Solo accesible para super Admin. Utilizar guard.
  @ApiOperation({
    summary: 'Borra la membresias de grupos segun id del parametro',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.groupMembershipService.remove(id);
  }
  @Roles(Role.Admin) // inyecta rol a la metadata
  @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get('MembershipsOfGroup/:id')
  async getUsersByAdmin(
    @Param('id') id: string, // Usa ParseIntPipe para convertir a número
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number = 6,
  ) {
    console.log('estas en admin membership');
    try {
      return await this.groupMembershipService.findMembersByGroupPaginated(
        +id,
        page,
        limit,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Auth(AuthType.None)
  @Put('groups/:groupId/members/:userId/status')
  @ApiOperation({ summary: 'Alternar estado active de un miembro' })
  async toggleMemberStatus(
    @Param('userId') userId: string,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    const response = await this.groupMembershipService.toggleMembershipStatus(
      userId,
      groupId,
    );
    console.log(response);
    return response;
  }
}
