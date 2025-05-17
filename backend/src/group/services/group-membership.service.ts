/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { GroupMembershipRepository } from '../repositories/group-membership.repository';
import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
import { User } from '../../user/entities/user.entity';
import { Group } from '../entities/group.entity';
import { GroupRole } from '../enums/group-role.enum';
import { GroupMembership } from '../entities/group-membership.entity';
import { GroupMemberResponseDto } from '../dto/group-member-response.dto';
import { UsersMembershipsDto, UserMembershipWithGroupDetailsDto } from '../dto/user-membership.dto';

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

  async findMembersByGroup(groupId: number): Promise<GroupMemberResponseDto[]> {
    const memberships = await this.groupMembershipRepository.findMembersByGroup(groupId);
    return memberships.map((membership) => ({
    id: membership.id,
    role: membership.role,
    status: membership.status,
    active: membership.active,
    joined_at: membership.joined_at,
    user: {
      id: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      active: membership.user.active,
    },
  }));
  }

  async findGroupsByUser(userId: string) {
    return this.groupMembershipRepository.findGroupsByUser(userId);
  }

  async getUserMemberships(userId: string): Promise<UsersMembershipsDto[]> {
    const memberships: GroupMembership[] = await this.findGroupsByUser(userId);
    console.log("Estoy en el getUserMemberships, este es el user id: ", userId);
    console.log("Membersias: ", memberships); // Loguea la entidad cruda si quieres verla

    // Mapea las entidades GroupMembership a UsersMembershipsDto
    return memberships.map((membership: GroupMembership) => {
      return {
        id: membership.id,
        active: membership.active,
        joined_at: membership.joined_at,
        status: membership.status,
        role: membership.role,
        group: {
          id: membership.group.id,
          name: membership.group.name,
          active: membership.group.active,
          emoji: membership.group.emoji ?? undefined, // Usa nullish coalescing para manejar undefined
        },
      };
    });
  }

  async getUserMembershipInGroup(userId: string, groupId: number): Promise<UserMembershipWithGroupDetailsDto> {
    const membership = await this.findByUserAndGroup(userId, groupId);
    if (!membership) {
      throw new Error('No membership found for this user in the specified group');
    }
    return {
      id: membership.id,
      active: membership.active,
      joined_at: membership.joined_at,
      status: membership.status,
      role: membership.role,
      group: {
        id: membership.group.id,
        name: membership.group.name,
        active: membership.group.active,
        emoji: membership.group.emoji ?? null,
        created_at: membership.group.created_at,
        locationName: membership.group.locationName ?? null,
        latitude: membership.group.latitude ?? null,
        longitude: membership.group.longitude ?? null,
        created_by: {
          id: membership.group.created_by.id,
          name: membership.group.created_by.name,
        },
      },
    };
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