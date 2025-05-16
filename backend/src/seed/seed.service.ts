/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/services/group.service';
import { GroupMembershipService } from '../group/services/group-membership.service';
import { ExpensesService } from '../expenses/expenses.service';
import { PaymentService } from '../payment/payment.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';

// Importa los seeds de datos
import { usersSeed } from './data/users.seed';
import { groupsSeed } from './data/groups.seed';
import { groupMembershipsSeed } from './data/group-membership.seed';
import { expensesSeed } from './data/expenses.seed';
import { expenseSplitsSeed } from './data/expense-splits.seed'; // Asegúrate de tener este seed
import { paymentsSeed } from './data/payments.seed';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Group } from '../group/entities/group.entity';
import { CreateGroupDto as CreateGroupServiceDto } from '../group/dto/create-group.dto'; // Alias para evitar conflicto
import { CreateGroupMembershipDto } from '../group/dto/create-group-membership.dto';
import { CreateExpenseDto } from '../expenses/dto/create-expense.dto';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { User } from '../user/entities/user.entity';
import { Expense } from 'src/expenses/entities/expense.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly groupMembershipService: GroupMembershipService,
    private readonly expensesService: ExpensesService,
    @InjectRepository(ExpenseSplit)
    private readonly expenseSplitRepository: Repository<ExpenseSplit>, // Inyecta el repositorio directamente
    private readonly paymentService: PaymentService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.ENABLE_SEED !== 'true') {
      console.log('[SeedService] Precarga deshabilitada por configuración.');
      return;
    }
    console.log('[SeedService] Ejecutando onModuleInit...');

    const users = await this.userService.findAll();
    if (users.length > 0) {
      console.log('[SeedService] Datos ya cargados. Ignorando precarga.');
      return;
    }

    console.log('[SeedService] Precargando base de datos...');

    // 1. Usuarios
    const createdUsers: User[] = await Promise.all(
      usersSeed.map(async (user) =>
        this.userService.createUserWithHashedPassword(user as CreateUserDto),
      ), // Usa createUserWithHashedPassword
    );
    console.log('[SeedService] Usuarios cargados.');

    // 2. Grupos
    const createdGroups: Group[] = [];
    for (const groupSeed of groupsSeed) {
      const createdBy = createdUsers.find(
        (u) => u.email === groupSeed.created_by.email,
      );
      if (!createdBy) {
        throw new Error(
          `Usuario no encontrado para el grupo: ${groupSeed.name}`,
        );
      }
      const createdGroup = await this.groupService.create(
        {
          name: groupSeed.name,
          creatorId: createdBy.id,
        } as CreateGroupServiceDto, // Usa CreateGroupServiceDto
        createdBy,
      );
      createdGroups.push(createdGroup);
    }
    console.log('[SeedService] Grupos cargados.');

    // 3. Membresías
    for (const membershipSeed of groupMembershipsSeed) {
      const user = createdUsers.find(
        (u) => u.email === membershipSeed.user.email,
      );
      const group = createdGroups.find(
        (g) => g.name === membershipSeed.group.name,
      );
      if (!user || !group) {
        throw new Error(`Usuario o grupo no encontrado para la membresía`);
      }
      await this.groupMembershipService.create(
        {
          status: membershipSeed.status,
          userId: user.id,
          groupId: group.id,
          role: membershipSeed.role,
        } as CreateGroupMembershipDto, // Usa CreateGroupMembershipDto
        user,
        group,
      );
    }
    console.log('[SeedService] Membresías cargadas.');

    // 4. Gastos
    const createdExpenses: Expense[] = [];
    for (const expenseSeed of expensesSeed) {
      const group = createdGroups.find(
        (g) => g.name === expenseSeed.group.name,
      );
      const paidBy = createdUsers.find(
        (u) => u.email === expenseSeed.paid_by.email,
      );
      if (!group || !paidBy) {
        throw new Error(
          `Grupo o usuario pagador no encontrado para el gasto: ${expenseSeed.description}`,
        );
      }

      const expenseDate =
        typeof expenseSeed.date === 'string'
          ? expenseSeed.date
          : new Date().toISOString();
      if (!expenseSeed.date) {
        console.warn(
          `[SeedService] La fecha del gasto "${expenseSeed.description}" no está definida. Se usará la fecha actual.`,
        );
      }

      const created = await this.expensesService.createExpense(group.id, {
        description: expenseSeed.description,
        amount: expenseSeed.amount,
        paid_by: paidBy.id,
        date: expenseDate,
        imgUrl: expenseSeed.imgUrl, // Si no existe en expenseSeed, será undefined
      } as CreateExpenseDto);
      createdExpenses.push(created);
    }
    console.log('[SeedService] Gastos cargados.');

    // 5. Divisiones (Manejo directo con el repositorio)
    if (this.expenseSplitRepository && expenseSplitsSeed) {
      for (const splitSeed of expenseSplitsSeed) {
        const expense = await this.expensesService.getExpenseByDescription(
          splitSeed.expense.description,
        ); // Asume que tienes un ID en el seed
        const user = createdUsers.find((u) => u.email === splitSeed.user.email);
        if (!expense || !user) {
          throw new Error(`Gasto o usuario no encontrado para la división`);
        }
        await this.expenseSplitRepository.save({
          expense: expense,
          user: user,
          amount_owed: splitSeed.amount_owed,
        });
      }
      console.log('[SeedService] Divisiones cargadas.');
    }

    // 6. Pagos
    for (const paymentSeed of paymentsSeed) {
      const user = createdUsers.find((u) => u.email === paymentSeed.user.email);
      if (!user) {
        throw new Error(
          `Usuario no encontrado para el pago con email: ${paymentSeed.user.email}`,
        );
      }
      await this.paymentService.create({
        userId: user.id,
        amount: paymentSeed.amount,
        status: paymentSeed.status,
        payment_date: paymentSeed.payment_date,
        transaction_id: paymentSeed.transaction_id,
      } as CreatePaymentDto); // Usa CreatePaymentDto
    }
    console.log('[SeedService] Pagos cargados.');
  }
}
