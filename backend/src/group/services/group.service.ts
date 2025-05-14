/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from '../repositories/group.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../entities/group.entity';
import { UserService } from '../../user/user.service';
import { GroupMembershipService } from './group-membership.service';
import { GroupRole } from '../enums/group-role.enum';
import { User } from '../../user/entities/user.entity'; // 👈 Importa la entidad User
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userService: UserService,
    private readonly groupMembershipService: GroupMembershipService,
    private readonly mailService: MailsService,
  ) {}

  async findOne(id: number): Promise<Group | null | undefined> {
    return await this.groupRepository.findOne(id);
  }

  async findAll() {
    return await this.groupRepository.findAll();
  }

  async findByUserid() {
    //
  }

  // async create( // Eliminamos esta función
  //   createGroupDto: CreateGroupDto,
  //   createdBy: User,
  // ): Promise<Group> {
  //   // 👈 Define el tipo de createdBy como User
  //   return await this.groupRepository.create(createGroupDto, createdBy);
  // }

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
    const group = await this.groupRepository.create(createGroupDto, creator); // Creamos el grupo directamente aquí

    if (group) {
      creator.total_groups_created++;
      await this.userService.update(creator.id, creator);
    }

    await this.addParticipantsToGroup(group, creator, createGroupDto.participants);
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

  // private async createGroup(createGroupDto: CreateGroupDto, creator: User): Promise<Group> { // Eliminamos esta función
  //   return await this.create(createGroupDto, creator);
  // }

  private async addParticipantsToGroup(group: Group, creator: User, participantIds: string[]): Promise<void> {
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

    await this.groupMembershipService.create({
      status: 'active',
      userId: creator.id,
      groupId: group.id,
      role: GroupRole.ADMIN,
    }, creator, group);
  }

  async findGroupsCreatedByUser(userId: string): Promise<Group[]> {
    return await this.groupRepository.findGroupsCreatedByUser(userId)
  }

  async softDelete(id: number): Promise<Group | undefined> {
    const group = await this.groupRepository.findOne(id);
    if (!group) {
      return undefined;
    }
    group.active = false;
    return await this.groupRepository.saveSoftDeleted(group);
  }
}