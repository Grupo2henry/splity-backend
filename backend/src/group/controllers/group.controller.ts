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
} from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { GroupMembershipService } from '../services/group-membership.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { UserService } from 'src/user/user.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
import { GroupMembership } from '../entities/group-membership.entity';

@ApiBearerAuth()
@Controller()
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupMembershipService: GroupMembershipService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post('groups')
  async create(@Body() createGroupDto: CreateGroupDto) {
    const creator = await this.userService.findOne(createGroupDto.creatorId);
    if (!creator) {
      throw new Error('Creador no encontrado');
    }

    const group = await this.groupService.create(
      { name: createGroupDto.name } as any,
      creator,
    );

    const memberships: GroupMembership[] = [];

    for (const userId of createGroupDto.participants) {
      const user = await this.userService.findOne(userId);
      if (!user) continue;

      const dto: CreateGroupMembershipDto = {
        status: 'active',
        userId: user.id,
        groupId: group.id,
      };

      const membership = await this.groupMembershipService.create(dto, user, group);
      memberships.push(membership);
    }

    return {
      message: 'Grupo creado con éxito',
      group,
      participants: memberships,
    };
  }

  @Get('groups')
  async findAll() {
    return this.groupService.findAll();
  }

  @Get('groups/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(id);
  }

  @Patch('groups/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete('groups/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.groupService.remove(id);
  }
}
