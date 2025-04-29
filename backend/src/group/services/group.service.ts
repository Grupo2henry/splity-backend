/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../repositories/group.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../entities/group.entity';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async findOne(id: number): Promise<Group | null | undefined>  {
    return await this.groupRepository.findOne(id);
  }

  async findAll() {
    console.log('Estoy en group.service')
    return await this.groupRepository.findAll();
  }

  async fingByUserid(){
    //
  }

  async create(createGroupDto: CreateGroupDto, createdBy: any) {
    return await this.groupRepository.create(createGroupDto, createdBy);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.update(id, updateGroupDto);
  }

  async remove(id: number) {
    return this.groupRepository.remove(id);
  }
}