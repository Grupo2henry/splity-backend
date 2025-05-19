/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import {
  Injectable, 
  Inject, 
  forwardRef,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GroupMembershipRepository } from '../repositories/group-membership.repository';
import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
import { User } from '../../user/entities/user.entity';
import { Group } from '../entities/group.entity';
import { GroupRole } from '../enums/group-role.enum';
import { GroupMembership } from '../entities/group-membership.entity';
import { GroupMemberResponseDto } from '../dto/group-member-response.dto';
import {
  UsersMembershipsDto,
  UserMembershipWithGroupDetailsDto,
} from '../dto/user-membership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { GetGroupsDto } from '../dto/get-groups.dto';
import { ExpensesService } from 'src/expenses/expenses.service';

@Injectable()
export class GroupMembershipService {
  constructor(
    @InjectRepository(GroupMembership)
    private readonly groupMembershipRepositoryDefault: Repository<GroupMembership>,
    private readonly groupMembershipRepository: GroupMembershipRepository,
    @Inject(forwardRef(() => ExpensesService))
    private readonly expensesService: ExpensesService,
  ) {}

  async findOne(id: number) {
    return this.groupMembershipRepository.findOne(id);
  }

  async findAll() {
    return this.groupMembershipRepository.findAll();
  }

  async create(
    createGroupMembershipDto: CreateGroupMembershipDto,
    user: User,
    group: Group,
  ) {
    if (createGroupMembershipDto.role === GroupRole.ADMIN) {
      const existingAdmin =
        await this.groupMembershipRepository.findByGroupAndRole(
          group.id,
          GroupRole.ADMIN,
        );

      if (existingAdmin) {
        throw new Error('El grupo ya tiene un administrador');
      }
    }
    return this.groupMembershipRepository.create(
      createGroupMembershipDto,
      user,
      group,
    );
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
    return memberships
      .filter((membership) => membership.active === true)
      .map((membership) => ({
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

  async findGroupsByUser(userId: string): Promise<GroupMembership[]> { // 👈 Modificar el tipo de retorno
    const memberships = await this.groupMembershipRepository.findGroupsByUser(userId);
    return memberships.filter((membership) => membership.active === true); // Filtrar aquí
  }

  async getUserMemberships(userId: string): Promise<UsersMembershipsDto[]> {
    const memberships: GroupMembership[] = await this.findGroupsByUser(userId); // Usar el método modificado
    console.log("Estoy en el getUserMemberships, este es el user id: ", userId);
    console.log("Membersias: ", memberships);

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
          emoji: membership.group.emoji ?? undefined,
        },
      };
    });
  }

  async getUserMembershipInGroup(
    userId: string,
    groupId: number,
  ): Promise<UserMembershipWithGroupDetailsDto> {
    const membership = await this.findByUserAndGroup(userId, groupId);
    if (!membership) {
      throw new Error(
        'No membership found for this user in the specified group',
      );
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
    const memberships = await this.groupMembershipRepository.findGroupsByUserAndRole(userId, role);
    return memberships.filter((membership) => membership.active === true);
  }

  async deactivate(id: number): Promise<GroupMembership | undefined> {
    const membership = await this.findOne(id);
    if (!membership) {
      return undefined;
    }
    membership.active = false;

    const userId = membership.user.id;
    const expensesToDeactivate = await this.expensesService.findAll();
    for (const expense of expensesToDeactivate) {
      if (expense.paid_by?.id === userId) {
        await this.expensesService.toggleActiveStatus(String(expense.id));
      }
    }
    return await this.groupMembershipRepository.saveDeactivated(membership);
  }
  async getGroups(userId: string, query: GetGroupsDto) {
    const { page = 1, limit = 6, search = '', startDate, endDate } = query;
    if (startDate && isNaN(new Date(startDate).getTime())) {
      throw new BadRequestException('Invalid startDate format');
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      throw new BadRequestException('Invalid endDate format');
    }
    const where: any = {
      user: { id: userId },
      active: true,
    };

    if (search) {
      where.group = { name: ILike(`%${search}%`) };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.joined_at = Between(start, end);
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      where.joined_at = MoreThanOrEqual(start);
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.joined_at = LessThanOrEqual(end);
    }

    console.log('where', where);
    try {
      const memberships = await this.groupMembershipRepositoryDefault.find({
        where,
        relations: ['group'],
        select: {
          group: { id: true, name: true, created_at: true },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.groupMembershipRepositoryDefault.count({
        where,
      });
      console.log('total de grupos', total);
      const groups = memberships.map((membership) => ({
        id: membership.group.id,
        name: membership.group.name,
        createdAt: membership.group.created_at,
      }));
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
  async toggleMembershipStatus(userId: string, groupId: number) {
    return this.groupMembershipRepositoryDefault.manager.transaction(
      async (manager) => {
        const result = await manager
          .createQueryBuilder(GroupMembership, 'membership')
          .update(GroupMembership)
          .set({ active: () => 'NOT active' })
          .where('userId = :userId AND groupId = :groupId', { userId, groupId }) // Usa userId y groupId
          .returning(['id', 'active'])
          .execute();

        if (result.affected === 0) {
          console.log(
            `No se encontró membresía para userId: ${userId}, groupId: ${groupId}`,
          );
          throw new NotFoundException(
            `Membresía no encontrada para userId ${userId} y groupId ${groupId}`,
          );
        }

        const updated = result.raw[0];
        return {
          success: true,
          newStatus: updated.active,
          membershipId: updated.id,
        };
      },
    );
  }
  public async findMembersByGroupPaginated(
    groupId: number,
    page: number,
    limit: number,
  ) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [memberships, total] =
      await this.groupMembershipRepositoryDefault.findAndCount({
        where: { group: { id: groupId } },
        relations: ['user'],
        skip,
        take,
        order: { user: { name: 'DESC' } }, // Orden descendente por nombre de usuario
      });

    const data = memberships.map((membership) => ({
      id: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      active: membership.active,
    }));

    return {
      data,
      total,
      page: Number(page),
      lastPage: Math.ceil(total / take),
    };
  }
}
