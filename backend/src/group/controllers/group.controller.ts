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
    Request,
  } from '@nestjs/common';
  import { GroupService } from '../services/group.service';
  import { CreateGroupDto } from '../dto/create-group.dto';
  import { UpdateGroupDto } from '../dto/update-group.dto';
  //import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { User } from '../../user/entities/user.entity'; //Asegúrate de que la ruta sea correcta
  
  @Controller('group')
  export class GroupController {
    constructor(private readonly groupService: GroupService) {}
  
    //@UseGuards(JwtAuthGuard) // Protege la ruta para que solo usuarios autenticados puedan crear grupos
    @Post()
    async create(@Body() createGroupDto: CreateGroupDto, @Request() req: any) {
      // El guard JwtAuthGuard añade el usuario autenticado al objeto Request.
      const user: User = req.user;
      return this.groupService.create(createGroupDto, user);
    }
  
    @Get()
    async findAll() {
      console.log('Estoy en group.controller')
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
    @HttpCode(HttpStatus.NO_CONTENT) // Establece el código de estado para una eliminación exitosa sin contenido
    async remove(@Param('id', ParseIntPipe) id: number) {
      await this.groupService.remove(id);
    }
  }
  