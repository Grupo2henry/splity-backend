/* eslint-disable prettier/prettier */
import {
<<<<<<< HEAD:backend/src/group/controllers/group-membership.controller.ts
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
  } from '@nestjs/common';
  import { GroupMembershipService } from '../services/group-membership.service';
  import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
  import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
  import { UserService } from '../../user/user.service';
  import { GroupService } from '../services/group.service';
  
  @Controller('group/membership')
  export class GroupMembershipController {
    constructor(
        private readonly groupMembershipService: GroupMembershipService,
        private readonly userService: UserService,
        private readonly groupService: GroupService,
    ) {}
  
    @Post()
async create(@Body() createGroupMembershipDto: CreateGroupMembershipDto) {
  const user = await this.userService.findOne(createGroupMembershipDto.userId);
  if (!user) {
    // Manejar el error si el usuario no existe
    // Puedes lanzar una excepción HttpNotFoundException
    throw new Error('Usuario no encontrado'); // Ejemplo simple
=======
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GroupMembershipService } from './group-membership.service';
import { CreateGroupMembershipDto } from './dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from './dto/update-group-membership.dto';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';

@Controller('group-membership')
export class GroupMembershipController {
  constructor(
    private readonly groupMembershipService: GroupMembershipService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  @Post()
  async create(@Body() createGroupMembershipDto: CreateGroupMembershipDto) {
    const user = await this.userService.findOne(
      String(createGroupMembershipDto.userId),
    );
    if (!user) {
      // Manejar el error si el usuario no existe
      // Puedes lanzar una excepción HttpNotFoundException
      throw new Error('Usuario no encontrado'); // Ejemplo simple
    }

    const group = await this.groupService.findOne(
      createGroupMembershipDto.groupId,
    );
    if (!group) {
      // Manejar el error si el grupo no existe
      // Puedes lanzar una excepción HttpNotFoundException
      throw new Error('Grupo no encontrado'); // Ejemplo simple
    }

    return this.groupMembershipService.create(
      createGroupMembershipDto,
      user,
      group,
    );
>>>>>>> develop:backend/src/group-membership/group-membership.controller.ts
  }

  @Get()
  async findAll() {
    return this.groupMembershipService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupMembershipService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupMembershipDto: UpdateGroupMembershipDto,
  ) {
    return this.groupMembershipService.update(id, updateGroupMembershipDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.groupMembershipService.remove(id);
  }

  @Get('user/:userId')
  async findGroupsByUser(@Param('userId') userId: string) {
    return this.groupMembershipService.findGroupsByUser(userId);
  }

  @Get('group/:groupId/members')
  async findMembersByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupMembershipService.findMembersByGroup(groupId);
  }

  @Get('user/:userId/group/:groupId')
  async findByUserAndGroup(
    @Param('userId') userId: string,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.groupMembershipService.findByUserAndGroup(userId, groupId);
  }
}
