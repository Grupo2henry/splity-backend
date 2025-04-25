/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupRepository } from './group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Group])], // <--- Group es tu entidad
  providers: [GroupService, GroupRepository],
  exports: [GroupService],
})
export class GroupModule {}
