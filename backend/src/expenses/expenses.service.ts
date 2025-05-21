/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Expense } from './entities/expense.entity';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/services/group.service';
import { GetExpensesDto } from './dto/get-expense.dto';
import { format } from 'date-fns';

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
    const expense = await this.expenseRepository.findOne({
      where: { description },
      relations: ['paid_by'],
    });
    if (!expense) {
      throw new NotFoundException(
        `Expense with description "${description}" not found`,
      );
    }
    return expense;
  }

  async createExpense(groupId: number, dto: CreateExpenseDto) {
    try {
      // Verificar que el usuario existe
      const user = await this.userService.findOne(dto.paid_by);
      if (!user) {
        throw new NotFoundException(
          `Cannot create expense: User with id ${dto.paid_by} not found`,
        );
      }

      // Verificar que el grupo existe
      const group = await this.groupService.findOne(groupId);
      if (!group) {
        throw new NotFoundException(
          `Cannot create expense: Group with id ${groupId} not found`,
        );
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

  async updateExpense(
    id: string,
    updateData: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    if (updateData.paid_by) {
      try {
        await this.userService.findOne(updateData.paid_by);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(
            `Cannot update expense: User with id ${updateData.paid_by} not found`,
          );
        }
        throw error;
      }
    }

    const transformedData: any = {
      ...updateData,
      paid_by: updateData.paid_by
        ? { id: String(updateData.paid_by) }
        : undefined,
    };

    const updateResult = await this.expenseRepository.update(
      id,
      transformedData,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(
        `Expense with id ${id} not found or no changes were made`,
      );
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

  async getExpensesOfGroup(groupId: string, query: GetExpensesDto) {
    const {
      page = 1,
      limit = 6,
      search = '',
      startDate,
      endDate,
      sinceAmount,
      untilAmount,
    } = query;
    if (startDate && isNaN(new Date(startDate).getTime())) {
      throw new BadRequestException('Invalid startDate format');
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      throw new BadRequestException('Invalid endDate format');
    }

    const where: any = {
      group: { id: groupId },
      // active: true,
    };

    if (search) {
      where.description = ILike(`%${search}%`);
    }
    if (sinceAmount !== undefined && untilAmount !== undefined) {
      where.amount = Between(sinceAmount, untilAmount);
    } else if (sinceAmount !== undefined) {
      where.amount = MoreThanOrEqual(sinceAmount);
    } else if (untilAmount !== undefined) {
      where.amount = LessThanOrEqual(untilAmount);
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

    console.log('where', where);
    try {
      const exps = await this.expenseRepository.find({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.expenseRepository.count({
        where,
      });
      console.log('total de gastos', total);
      const dataExpenses = exps.map((expense) => ({
        id: expense.id,
        name: expense.description,
        createdAt: format(new Date(expense.created_at), 'dd/MM/yyyy HH:mm'),
        active: expense.active,
        amount: expense.amount,
        paid_by: expense.paid_by,
      }));
      return {
        data: dataExpenses,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(
        'Error fetching expenses: ' + error.message,
      );
    }
  }
  async findExpensesGeneral(params: {
    page: number;
    limit: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    sinceAmount?: number;
    untilAmount?: number;
    active?: boolean;
  }) {
    const {
      page = 1,
      limit = 8,
      search = '',
      startDate,
      endDate,
      sinceAmount,
      untilAmount,
      active,
    } = params;

    // Validar fechas
    if (startDate && isNaN(new Date(startDate).getTime())) {
      throw new BadRequestException('Formato de startDate inválido');
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      throw new BadRequestException('Formato de endDate inválido');
    }

    // Construir condiciones de búsqueda
    const where: any = {};

    if (search) {
      where.description = ILike(`%${search}%`);
    }

    if (sinceAmount !== undefined && untilAmount !== undefined) {
      where.amount = Between(sinceAmount, untilAmount);
    } else if (sinceAmount !== undefined) {
      where.amount = MoreThanOrEqual(sinceAmount);
    } else if (untilAmount !== undefined) {
      where.amount = LessThanOrEqual(untilAmount);
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
      where.group = { active };
    }
    try {
      const [expenses, total] = await this.expenseRepository.findAndCount({
        select: {
          id: true,
          description: true,
          active: true,
          amount: true,
          created_at: true,
          date: true,
          imgUrl: true,
          group: {
            id: true,
            name: true,
            active: true,
          },
          paid_by: { name: true },
        },
        where,
        relations: ['group', 'paid_by'],
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
      });

      return {
        data: expenses,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
        total,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al obtener gastos: ${error.message}`,
      );
    }
  }
}
