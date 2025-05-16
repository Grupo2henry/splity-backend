/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
@Injectable()
export class GroupRepository {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async findOne(id: number): Promise<Group | null | undefined> {
    return this.groupRepository.findOne({
      where: { id },
      relations: [
        'created_by',
        'memberships',
        'expenses',
        'memberships.user', // Asegúrate de cargar el usuario de la membresía
        'expenses.paid_by',
        'expenses.splits',
        'expenses.splits.user',
      ],
    });
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepository.find({
      relations: [
        'created_by',
        'memberships',
        'expenses',
        'memberships.user', // Asegúrate de cargar el usuario de la membresía
        'expenses.paid_by',
        'expenses.splits',
        'expenses.splits.user',
      ],
    });
  }

  async create(createGroupDto: CreateGroupDto, createdBy): Promise<Group> {
    const newGroup = this.groupRepository.create({
      ...createGroupDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      created_by: createdBy,
      created_at: new Date(),
    });
    return this.groupRepository.save(newGroup);
  }

  async update(
    id: number,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group | null | undefined> {
    await this.groupRepository.update(id, updateGroupDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.groupRepository.delete(id);
  }

  async findGroupsCreatedByUser(userId: string): Promise<Group[]> {
    return this.groupRepository.find({
      where: { created_by: { id: userId } },
      relations: ['created_by', 'memberships', 'expenses', 'memberships.user'], // ¡Carga también 'memberships.user'!
    });
  }

  async saveSoftDeleted(group: Group): Promise<Group> {
    return await this.groupRepository.save(group);
  }

  async countActiveGroupsCreatedByUser(userId: string): Promise<number> {
  return await this.groupRepository.count({
    where: {
      created_by: { id: userId },
      active: true,
    },
  });
}
}