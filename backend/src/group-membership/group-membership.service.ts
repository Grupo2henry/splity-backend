/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { GroupMembershipRepository } from './group-membership.repository';
import { CreateGroupMembershipDto } from './dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from './dto/update-group-membership.dto';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';

@Injectable()
export class GroupMembershipService {
  constructor(
    private readonly groupMembershipRepository: GroupMembershipRepository,
  ) {}

  async findOne(id: number) {
    return this.groupMembershipRepository.findOne(id);
  }

  async findAll() {
    return this.groupMembershipRepository.findAll();
  }

  async create(createGroupMembershipDto: CreateGroupMembershipDto, user: User, group: Group) {
    return this.groupMembershipRepository.create(createGroupMembershipDto, user, group);
  }

  async update(id: number, updateGroupMembershipDto: UpdateGroupMembershipDto) {
    return this.groupMembershipRepository.update(id, updateGroupMembershipDto);
  }

  async remove(id: number) {
    return this.groupMembershipRepository.remove(id);
  }

  async findByUserAndGroup(userId: string, groupId: number) {
    return this.groupMembershipRepository.findByUserAndGroup(userId, groupId);
  }

  async findMembersByGroup(groupId: number) {
    return this.groupMembershipRepository.findMembersByGroup(groupId);
  }

  async findGroupsByUser(userId: string) {
    return this.groupMembershipRepository.findGroupsByUser(userId);
  }
}