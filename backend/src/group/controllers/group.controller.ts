/* eslint-disable prettier/prettier */
import {
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
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { GroupService } from '../services/group.service';
  import { CreateGroupDto } from '../dto/create-group.dto';
  import { UpdateGroupDto } from '../dto/update-group.dto';
  //import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { User } from '../../user/entities/user.entity'; //Asegúrate de que la ruta sea correcta
  import { REQUEST_USER_KEY } from '../../auth/constants/auth.constants';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard/access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
  @Controller()
  export class GroupController {
    constructor(private readonly groupService: GroupService) {}
  
    //@UseGuards(JwtAuthGuard) // Protege la ruta para que solo usuarios autenticados puedan crear grupos
    @UseGuards(AccessTokenGuard)
    @Post('groups')
    async create(@Body() createGroupDto: CreateGroupDto, @Req() request: RequestWithUser) {
      // El guard JwtAuthGuard añade el usuario autenticado al objeto Request.
      const user = request[REQUEST_USER_KEY];
          if (!user) {
            throw new Error('User not found in request.');
          }
      return this.groupService.create(createGroupDto, user);
    }
  
    @Get('groups')
    async findAll() {
      console.log('Estoy en group.controller')
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
    @HttpCode(HttpStatus.NO_CONTENT) // Establece el código de estado para una eliminación exitosa sin contenido
    async remove(@Param('id', ParseIntPipe) id: number) {
      await this.groupService.remove(id);
    }
  }
