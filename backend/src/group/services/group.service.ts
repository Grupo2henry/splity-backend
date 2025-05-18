/* eslint-disable prettier/prettier */
// src/group/services/group.service.ts
import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { GroupRepository } from '../repositories/group.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../entities/group.entity';
import { UserService } from '../../user/user.service';
import { GroupMembershipService } from './group-membership.service';
import { GroupRole } from '../enums/group-role.enum';
import { User } from '../../user/entities/user.entity';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userService: UserService,
    @Inject(forwardRef(() => GroupMembershipService)) // 👈 Usar forwardRef aquí
    private readonly groupMembershipService: GroupMembershipService,
    private readonly mailService: MailsService,
  ) {}

  async findOne(id: number): Promise<Group | null | undefined> {
    return await this.groupRepository.findOne(id);
  }

  async findAll() {
    return await this.groupRepository.findAll();
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.update(id, updateGroupDto);
  }

  async remove(id: number) {
    return this.groupRepository.remove(id);
  }

  async createGroupWithParticipants(
    createGroupDto: CreateGroupDto,
    creatorId: string,
  ): Promise<Group> {
    const creator = await this.validateCreator(creatorId);
    const group = await this.groupRepository.create(createGroupDto, creator);

    if (group) {
      creator.total_groups_created++;
      await this.userService.update(creator.id, creator);
    }

    // Filtrar al creador para no agregarlo dos veces
    const filteredParticipants = createGroupDto.participants.filter(
      (id) => id !== creator.id,
    );

    await this.addParticipantsToGroup(group, creator, filteredParticipants);
    return group;
  }

  private async validateCreator(creatorId: string): Promise<User> {
    const creator = await this.userService.findOne(creatorId);
    if (!creator) {
      throw new NotFoundException(
        `No se encontró el creador con ID: ${creatorId}`,
      );
    }
    return creator;
  }

  private async addParticipantsToGroup(group: Group, creator: User, participantIds: string[]): Promise<void> {
    // Crear membresías para los participantes (excluyendo al creador)
    for (const userId of participantIds) {
      const user = await this.userService.findOne(userId);
      if (user) {
        await this.groupMembershipService.create(
          {
            status: 'active',
            userId: user.id,
            groupId: group.id,
            role: GroupRole.GUEST,
          },
          user,
          group,
        );
      }
    }

    // Crear la membresía del creador como ADMIN
    await this.groupMembershipService.create(
      {
        status: 'active',
        userId: creator.id,
        groupId: group.id,
        role: GroupRole.ADMIN,
      },
      creator,
      group,
    );
  }

  async findGroupsCreatedByUser(userId: string): Promise<Group[]> {
    return await this.groupRepository.findGroupsCreatedByUser(userId);
  }

  async softDelete(id: number): Promise<Group | undefined> {
    const group = await this.groupRepository.findOne(id);
    if (!group) {
      return undefined;
    }

    // Desactivar las membresías del grupo antes de desactivar el grupo
    const memberships = await this.groupMembershipService.findMembersByGroup(id);
    for (const membership of memberships) {
      await this.groupMembershipService.deactivate(membership.id);
    }

    group.active = false;
    return await this.groupRepository.saveSoftDeleted(group);
  }

  async countActiveGroupsCreatedByUser(userId: string): Promise<number> {
    return await this.groupRepository.countActiveGroupsCreatedByUser(userId);
  }
}