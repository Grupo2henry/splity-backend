/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/services/group.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
  ) {}

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({
      relations: ['paid_by'], // 👈 Cargar la relación paid_by
    });
  }

  async getExpenses(groupId: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: {
        group: { id: Number(groupId) },
        active: true,
      },
      relations: ['paid_by'], // 👈 Cargar la relación paid_by
    });
  }

  async getExpense(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: Number(id) },
      relations: ['paid_by', 'splits', 'splits.user'], // También cargamos splits si los usas en algún otro lado
    });
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

  // Nuevo método para buscar un gasto por su descripción exacta
  async getExpenseByDescription(description: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { description }, relations: ['paid_by'] });
    if (!expense) {
      throw new NotFoundException(`Expense with description "${description}" not found`);
    }
    return expense;
  }

  async createExpense(groupId: number, dto: CreateExpenseDto) {
    try {
      // Verificar que el usuario existe
      const user = await this.userService.findOne(dto.paid_by);
      if (!user) {
        throw new NotFoundException(`Cannot create expense: User with id ${dto.paid_by} not found`);
      }

      // Verificar que el grupo existe
      const group = await this.groupService.findOne(groupId);
      if (!group) {
        throw new NotFoundException(`Cannot create expense: Group with id ${groupId} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }

    const expense = this.expenseRepository.create({
      description: dto.description,
      amount: dto.amount,
      paid_by: { id: String(dto.paid_by) } as Partial<User>,
      group: { id: groupId } as Group,
      date: new Date(dto.date),
      imgUrl: dto.imgUrl,
    });

    return this.expenseRepository.save(expense);
  }

  async updateExpense(id: string, updateData: Partial<CreateExpenseDto>): Promise<Expense> {
    if (updateData.paid_by) {
      try {
        await this.userService.findOne(updateData.paid_by);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Cannot update expense: User with id ${updateData.paid_by} not found`);
        }
        throw error;
      }
    }

    const transformedData: any = {
      ...updateData,
      paid_by: updateData.paid_by ? { id: String(updateData.paid_by) } : undefined,
    };

    const updateResult = await this.expenseRepository.update(id, transformedData);

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Expense with id ${id} not found or no changes were made`);
    }

    return this.getExpense(id);
  }

  async deleteExpense(id: string): Promise<void> {
    const result = await this.expenseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
  }

  async toggleActiveStatus(id: string): Promise<Expense> {
    const expense = await this.getExpense(id);
    expense.active = !expense.active;
    return this.expenseRepository.save(expense);
  }
}