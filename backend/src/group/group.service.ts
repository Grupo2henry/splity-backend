/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async findOne(id: number) {
    return this.groupRepository.findOne(id);
  }

  async findAll() {
    return this.groupRepository.findAll();
  }

  async create(createGroupDto: CreateGroupDto, createdBy: any) {
    return this.groupRepository.create(createGroupDto, createdBy);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.update(id, updateGroupDto);
  }

  async remove(id: number) {
    return this.groupRepository.remove(id);
  }
}