/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// src/group/services/group.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepository } from '../repositories/group.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../entities/group.entity';
import { UserService } from '../../user/user.service';
import { GroupMembershipService } from './group-membership.service';
import { GroupRole } from '../enums/group-role.enum';
import { User } from '../../user/entities/user.entity';
import { MailsService } from 'src/mails/mails.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepositoryDefault: Repository<Group>,
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

  private async addParticipantsToGroup(
    group: Group,
    creator: User,
    participantIds: string[],
  ): Promise<void> {
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
    group.active = false;
    return await this.groupRepositoryDefault.save(group);
  }
  async softActivate(id: number): Promise<Group | undefined> {
    const group = await this.groupRepository.findOne(id);
    if (!group) {
      return undefined;
    }
    group.active = true;
    return await this.groupRepositoryDefault.save(group);
  }

  async countActiveGroupsCreatedByUser(userId: string): Promise<number> {
    return await this.groupRepository.countActiveGroupsCreatedByUser(userId);
  }
  async findOneAdmin(id: number) {
    const group = await this.groupRepositoryDefault.findOne({
      where: { id },
      relations: ['memberships', 'expenses', 'created_by'], // Carga las relaciones necesarias
    });

    if (!group) {
      return {
        group: null,
        membershipCount: 0,
        expenseCount: 0,
      };
    }

    const { memberships, expenses, ...groupWithoutRelations } = group;
    const modifiedGroup = {
      ...groupWithoutRelations,
      membershipCount: memberships?.length ?? 0,
      expenseCount: expenses?.length ?? 0,
    };
    return modifiedGroup;
  }
  async findGroupsGeneral(params: {
    page: number;
    limit: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    active?: boolean;
  }) {
    const {
      page = 1,
      limit = 8,
      search = '',
      startDate,
      endDate,
      active,
    } = params;

    if (startDate && isNaN(new Date(startDate).getTime())) {
      throw new BadRequestException('Invalid startDate format');
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      throw new BadRequestException('Invalid endDate format');
    }

    const where: any = {};
    if (search) {
      where.name = ILike(`%${search}%`);
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.created_at = Between(start, end);
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      where.created_at = MoreThanOrEqual(start);
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.created_at = LessThanOrEqual(end);
    }
    if (active !== undefined) {
      where.active = active; // Agregar filtro por active
    }

    try {
      const groups = await this.groupRepositoryDefault.find({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.groupRepositoryDefault.count({
        where,
      });
      console.log('total de grupos', total);
      console.log('grupos', groups);
      return {
        data: groups,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException('Error fetching groups: ' + error.message);
    }
  }
}
