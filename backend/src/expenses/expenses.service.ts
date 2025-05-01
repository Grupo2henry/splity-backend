/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async findAll(): Promise<Expense[]>{
    return this.expenseRepository.find()
  }

  async getExpenses(groupId: string): Promise<Expense[]> {
    return this.expenseRepository.find({ where: { group: { id: Number(groupId) } } });
  }

  async getExpense(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { id: Number(id) } });
    if (!expense) {
      throw new Error(`Expense with id ${id} not found`);
    }
    return expense;
  }

  async createExpense(groupId: number, dto: CreateExpenseDto) {
    const expense = this.expenseRepository.create({
      description: dto.description,
      amount: dto.amount,
      paid_by: { id: String(dto.paid_by) } as Partial<User>,
      group: { id: groupId } as Group,
    });

    return this.expenseRepository.save(expense);
  }

  async updateExpense(id: string, updateData: Partial<CreateExpenseDto>): Promise<Expense> {
    const transformedData: any = {
      ...updateData,
      paid_by: updateData.paid_by ? { id: String(updateData.paid_by) } : undefined,
    };
    await this.expenseRepository.update(id, transformedData);
    return this.getExpense(id);
  }

  async deleteExpense(id: string): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}