/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupMembershipRepository } from '../repositories/group-membership.repository';
import { CreateGroupMembershipDto } from '../dto/create-group-membership.dto';
import { UpdateGroupMembershipDto } from '../dto/update-group-membership.dto';
import { User } from '../../user/entities/user.entity';
import { Group } from '../entities/group.entity';
import { GroupRole } from '../enums/group-role.enum';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembership } from '../entities/group-membership.entity';
import { GetGroupsDto } from '../dto/get-groups.dto';

@Injectable()
export class GroupMembershipService {
  constructor(
    private readonly groupMembershipRepository: GroupMembershipRepository,
    @InjectRepository(GroupMembership)
    private readonly groupMembershipRepositoryDefault: Repository<GroupMembership>,
  ) {}

  async findOne(id: number) {
    return this.groupMembershipRepository.findOne(id);
  }

  async findAll() {
    return this.groupMembershipRepository.findAll();
  }

  async findByUserAndGroup(userId: string, groupId: number) {
    return this.groupMembershipRepository.findByUserAndGroup(userId, groupId);
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

  async findMembersByGroup(groupId: number) {
    return this.groupMembershipRepository.findMembersByGroup(groupId);
  }

  async findGroupsByUser(userId: string) {
    return this.groupMembershipRepository.findGroupsByUser(userId);
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

  // async findGroupsByUserAndRole(
  //   userId: string,
  //   role: string,
  // ): Promise<GroupMembership[]> {
  //   return await this.groupMembershipRepository.findGroupsByUserAndRole(
  //     userId,
  //     role,
  //   );
  // }

  // async deactivate(id: number): Promise<GroupMembership | undefined> {
  //   const membership = await this.findOne(id);
  //   if (!membership) {
  //     return undefined; // O lanza una NotFoundException aquí
  //   }
  //   membership.active = false;
  //   return await this.groupMembershipRepository.saveDeactivated(membership); // 👈 Llama a un método en el repositorio
  // }
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
  // async updateMembership(userId: string, groupId: number) {
  //   // Buscar la membresía sin cargar relaciones innecesarias
  //   const membership = await this.groupMembershipRepositoryDefault.findOne({
  //     where: {
  //       user: { id: userId }, // user.id es string
  //       group: { id: Equal(groupId) }, // group.id es number
  //     },
  //   });

  //   if (!membership) {
  //     throw new NotFoundException('Membresía no encontrada');
  //   }
  //   // Alternar el valor correctamente
  //   membership.active = !membership.active;
  //   console.log(
  //     `Cambiando active de ${!membership.active} a ${membership.active}`,
  //   );

  //   const updated =
  //     await this.groupMembershipRepositoryDefault.save(membership);
  //   return updated; // Asegúrate de devolver el objeto actualizado
  // }
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
}
