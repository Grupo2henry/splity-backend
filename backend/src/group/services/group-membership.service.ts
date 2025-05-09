/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { GroupMembershipRepository } from '../repositories/group-membership.repository';
import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
import { User } from '../../user/entities/user.entity';
import { Group } from '../entities/group.entity';
import { GroupRole } from '../enums/group-role.enum';
import { GroupMembership } from '../entities/group-membership.entity';

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
    if (createGroupMembershipDto.role === GroupRole.ADMIN) {
      const existingAdmin = await this.groupMembershipRepository.findByGroupAndRole(
        group.id,
        GroupRole.ADMIN,
      );

      if (existingAdmin) {
        throw new Error('El grupo ya tiene un administrador');
      }
    }
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

  async findGroupsByUserAndRole(userId: string, role: string): Promise<GroupMembership[]> {
    return await this.groupMembershipRepository.findGroupsByUserAndRole(userId, role);
  }

  async deactivate(id: number): Promise<GroupMembership | undefined> {
    const membership = await this.findOne(id);
    if (!membership) {
      return undefined; // O lanza una NotFoundException aquí
    }
    membership.active = false;
    return await this.groupMembershipRepository.saveDeactivated(membership); // 👈 Llama a un método en el repositorio
  }
}