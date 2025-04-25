/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { usersSeed } from './data/users.seed';
import { groupsSeed } from './data/groups.seed';
import { groupMembershipsSeed } from './data/group-membership.seed';
import { expensesSeed } from './data/expenses.seed';
import { expenseSplitsSeed } from './data/expense-splits.seed';
import { paymentsSeed } from './data/payments.seed';
import { subscriptionsSeed } from './data/subscription.seed';

import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { GroupMembership } from '../group-membership/entities/group-membership.entity';
import { Expense } from '../entities/expense.entity';
import { ExpenseSplit } from '../entities/expense.split.entity';
import { Payment } from '../entities/payments.entity';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMembership) private membershipRepo: Repository<GroupMembership>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
    @InjectRepository(ExpenseSplit) private splitRepo: Repository<ExpenseSplit>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Subscription) private subscriptionRepo: Repository<Subscription>,
  ) {}

  async onApplicationBootstrap() {
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      console.log('[SeedService] Datos ya cargados. Ignorando precarga.');
      return;
    }

    console.log('[SeedService] Precargando base de datos...');

    // 1. Usuarios
    const users = await this.userRepo.save(usersSeed);

    // 2. Grupos
    for (const group of groupsSeed) {
      const createdByUser = users.find(u => u.email === group.created_by.email);
      if (!createdByUser) {
        throw new Error(`Usuario no encontrado para el grupo: ${group.nombre}`);
      }
      group.created_by = createdByUser;
    }
    const groups = await this.groupRepo.save(groupsSeed);

    // 3. Membresías
    for (const membership of groupMembershipsSeed) {
      const user = users.find(u => u.email === membership.user.email);
      const group = groups.find(g => g.nombre === membership.group.nombre);
      if (!user) {
        throw new Error(`Usuario no encontrado para la membresía`);
      }
      if (!group) {
        throw new Error(`Grupo no encontrado para la membresía`);
      }
      membership.user = user;
      membership.group = group;
    }
    await this.membershipRepo.save(groupMembershipsSeed);

    // 4. Gastos
    for (const expense of expensesSeed) {
      const group = groups.find(g => g.nombre === expense.group.nombre);
      const pagadoPor = users.find(u => u.email === expense.pagado_por.email);
      if (!group) {
        throw new Error(`Grupo no encontrado para el gasto: ${expense.descripcion}`);
      }
      if (!pagadoPor) {
        throw new Error(`Usuario pagador no encontrado para el gasto: ${expense.descripcion}`);
      }
      expense.group = group;
      expense.pagado_por = pagadoPor;
    }
    const expenses = await this.expenseRepo.save(expensesSeed);

    // 5. Divisiones
    for (const split of expenseSplitsSeed) {
      const expense = expenses.find(e => e.descripcion === split.expense.descripcion);
      const user = users.find(u => u.email === split.user.email);
      if (!expense) {
        throw new Error(`Gasto no encontrado para la división`);
      }
      if (!user) {
        throw new Error(`Usuario no encontrado para la división`);
      }
      split.expense = expense;
      split.user = user;
    }
    await this.splitRepo.save(expenseSplitsSeed);

    // 6. Pagos
    for (const payment of paymentsSeed) {
      const user = users.find(u => u.email === payment.user.email);
      if (!user) {
        throw new Error(`Usuario no encontrado para el pago`);
      }
      payment.user = user;
    }
    await this.paymentRepo.save(paymentsSeed);

    // 7. Subscripciones
    for (const sub of subscriptionsSeed) {
      const user = users.find(u => u.email === sub.user.email);
      if (!user) {
        throw new Error(`Usuario no encontrado para la subscripción`);
      }
      sub.user = user;
    }
    await this.subscriptionRepo.save(subscriptionsSeed);

    console.log('[SeedService] Datos precargados correctamente.');
  }
}
