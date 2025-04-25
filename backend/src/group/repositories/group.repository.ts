/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async findOne(id: number): Promise<Group | null | undefined> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['created_by', 'memberships', 'expenses', 'memberships.user', 'expenses.paid_by', 'expenses.splits', 'expenses.splits.user'],
    });
  }

  async findAll(): Promise<Group[]> {
    console.log('Estoy en group.repository')
    return this.groupRepository.find({
      relations: ['created_by', 'memberships', 'expenses', 'memberships.user', 'expenses.paid_by', 'expenses.splits', 'expenses.splits.user'],
    });
  }

  async create(createGroupDto: CreateGroupDto, createdBy: User): Promise<Group> {
    const newGroup = this.groupRepository.create({
      ...createGroupDto,
      created_by: createdBy,
      created_at: new Date(),
    });
    return this.groupRepository.save(newGroup);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Group | null | undefined> {
    await this.groupRepository.update(id, updateGroupDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.groupRepository.delete(id);
  }
}