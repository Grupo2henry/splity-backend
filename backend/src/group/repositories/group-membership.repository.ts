/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMembership } from '../entities/group-membership.entity';
import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
import { User } from '../../user/entities/user.entity';
import { Group } from '../entities/group.entity';
import { GroupRole } from '../enums/group-role.enum';

@Injectable()
export class GroupMembershipRepository {
  constructor(
    @InjectRepository(GroupMembership)
    private readonly groupMembershipRepository: Repository<GroupMembership>,
  ) {}

  async findOne(id: number): Promise<GroupMembership | null | undefined> {
    return this.groupMembershipRepository.findOne({
      where: { id },
      relations: ['user', 'group'],
    });
  }

  async findAll(): Promise<GroupMembership[]> {
    return this.groupMembershipRepository.find({
      relations: ['user', 'group'],
    });
  }

  async create(
    createGroupMembershipDto: CreateGroupMembershipDto,
    user: User,
    group: Group,
  ): Promise<GroupMembership> {
    const newMembership = this.groupMembershipRepository.create({
      ...createGroupMembershipDto,
      user: user,
      group: group,
      joined_at: new Date(),
    });
    return this.groupMembershipRepository.save(newMembership);
  }

  async update(
    id: number,
    updateGroupMembershipDto: UpdateGroupMembershipDto,
  ): Promise<GroupMembership | null | undefined> {
    await this.groupMembershipRepository.update(id, updateGroupMembershipDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.groupMembershipRepository.delete(id);
  }

  async findByUserAndGroup(userId: string, groupId: number): Promise<GroupMembership | null | undefined> {
    return this.groupMembershipRepository.findOne({
      where: { user: { id: userId }, group: { id: groupId } },
      relations: ['user', 'group'],
    });
  }

  async findMembersByGroup(groupId: number): Promise<GroupMembership[]> {
    return this.groupMembershipRepository.find({
      where: { group: { id: groupId } },
      relations: ['user'],
    });
  }

  async findGroupsByUser(userId: string): Promise<GroupMembership[]> {
    return this.groupMembershipRepository.find({
      where: { user: { id: userId } },
      relations: ['group'],
    });
  }
  
  async findByGroupAndRole(groupId: number, role: GroupRole) {
    return this.groupMembershipRepository.findOne({
      where: {
        group: { id: groupId },
        role: role,
      },
    });
  }
}