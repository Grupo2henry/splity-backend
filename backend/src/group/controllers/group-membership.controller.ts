/* eslint-disable prettier/prettier */
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
    Req
  } from '@nestjs/common';
  import { GroupMembershipService } from '../services/group-membership.service';
  import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
  import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
  import { UserService } from '../../user/user.service';
  import { GroupService } from '../services/group.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard/access-token.guard';
import { REQUEST_USER_KEY } from '../../auth/constants/auth.constants';
import { RequestWithUser } from '../../auth/types/request-with-user';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
  @Controller('memberships')
  export class GroupMembershipController {
    constructor(
        private readonly groupMembershipService: GroupMembershipService,
        private readonly userService: UserService,
        private readonly groupService: GroupService,
    ) {}
  
    @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGroupMembershipDto: CreateGroupMembershipDto) {
    const user = await this.userService.findOne(createGroupMembershipDto.userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const group = await this.groupService.findOne(createGroupMembershipDto.groupId);
    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }

    const existingMembership = await this.groupMembershipService.findByUserAndGroup(
      createGroupMembershipDto.userId,
      createGroupMembershipDto.groupId,
    );

    if (existingMembership) {
      throw new Error('El usuario ya es miembro del grupo.');
    }

    const membership = await this.groupMembershipService.create(createGroupMembershipDto, user, group);

    return {
      message: 'Membresía creada exitosamente',
      membership,
    };
  }

  @Get()
  async findAll() {
    console.log("Estoy en group/membership")
    return this.groupMembershipService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log("Estoy en group/membership/:id")
    return this.groupMembershipService.findOne(id);
  }

  @Put(':id')
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

  
  @Get('users/groups')
  @UseGuards(AccessTokenGuard)
  async findGroupsByUser(@Req() request: RequestWithUser) {
    console.log("Estoy en membership, pase el Guard.")
    const user = request[REQUEST_USER_KEY];
    if (!user) {
      throw new Error('User not found in request.');
    }
    return this.groupMembershipService.findGroupsByUser(user.id);
  }

  @Get('groups/:groupId/members')
  async findMembersByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupMembershipService.findMembersByGroup(groupId);
  }

  @Get('groups/:groupId/members/:userId')
  async findByUserAndGroup(
    @Param('userId') userId: string,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.groupMembershipService.findByUserAndGroup(userId, groupId);
  }
}
