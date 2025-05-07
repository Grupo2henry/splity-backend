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
    console.log('Estoy en group.service');
    return await this.groupRepository.findAll();
  }

  async findByUserid() {
    //
  }

  async create(
    createGroupDto: CreateGroupDto,
    createdBy: User,
  ): Promise<Group> {
    // 👈 Define el tipo de createdBy como User
    return await this.groupRepository.create(createGroupDto, createdBy);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.update(id, updateGroupDto);
  }

  async remove(id: number) {
    return this.groupRepository.remove(id);
  }

  async createGroupWithParticipants(
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    const creator = await this.validateCreator(createGroupDto.creatorId);
    const group = await this.createGroup(createGroupDto.name, creator);
    await this.addParticipantsToGroup(
      group,
      creator,
      createGroupDto.participants,
    );
    const groupName = createGroupDto.name;
    const user = await this.userService.findOne(creator.id);
    const users = await Promise.all(
      createGroupDto.participants.map((participant) =>
        this.userService.findOne(participant),
      ),
    );
    const allUsers = [user, ...users];
    await this.mailService.sendGruopConfirmation(allUsers, groupName);
    return group;
  }

  private async validateCreator(creatorId: string): Promise<User> {
    // 👈 Define el tipo de retorno como Promise<User>
    const creator = await this.userService.findOne(creatorId);
    if (!creator) {
      throw new NotFoundException(
        `No se encontró el creador con ID: ${creatorId}`,
      );
    }
    return creator;
  }

  private async createGroup(name: string, creator: User): Promise<Group> {
    // 👈 Define el tipo de creator como User
    const groupDto: CreateGroupDto = { name } as CreateGroupDto; // Creamos un DTO parcial para la creación del grupo
    return await this.create(groupDto, creator);
  }

  private async addParticipantsToGroup(
    group: Group,
    creator: User,
    participantIds: string[],
  ): Promise<void> {
    // 👈 Define los tipos de creator como User
    // Agregar participantes como GUEST
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

    // Agregar al creador como ADMIN
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
}
