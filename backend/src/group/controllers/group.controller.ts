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
  Req
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
  } from '@nestjs/swagger';
import { GroupService } from '../services/group.service';
import { GroupMembershipService } from '../services/group-membership.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { UserService } from 'src/user/user.service';
import { Group } from '../entities/group.entity';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard/access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user';
import { REQUEST_USER_KEY } from '../../auth/constants/auth.constants';

@ApiBearerAuth()
@Controller('groups')
@ApiTags('Groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupMembershipService: GroupMembershipService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({
      summary: 'Crea un grupo/evento nuevo con un listado de participantes',
    })
    @ApiOkResponse({
      description: 'Grupo creado nuevamente',
      schema: {
        example: {
          creatorId: "d8a7382c-bb90-4e83-8882-c7486c9b279d",
          name: "Nuevo Grupo de Amigos",
          participants: [
            "9c144b66-9dc9-4df1-ba78-f3b44b1a982d",
            "14e8bb7f-a2c1-4f03-b244-635f970547ce",
            "40586790-bca4-4e0b-b88b-2f104594337c"
          ]
        },
      },
    })
    async create(@Body() createGroupDto: CreateGroupDto, @Req() request: RequestWithUser): Promise<Group> {
       console.log("Estoy en membership, pase el Guard.")
          const user = request[REQUEST_USER_KEY];
          if (!user) {
            throw new Error('User not found in request.');
          }
      console.log("datos del usuario logueado creando el grupo: ", user)
      return await this.groupService.createGroupWithParticipants(createGroupDto);
    }

  @Get()
  async findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.groupService.remove(id);
  }
}
