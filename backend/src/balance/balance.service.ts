/* eslint-disable prettier/prettier */
// src/balance/balance.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expenses/entities/expense.entity';
import { GroupMembershipService } from '../group/services/group-membership.service';
import { UserService } from '../user/user.service';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private readonly expenseSplitRepository: Repository<ExpenseSplit>,
    @Inject(GroupMembershipService)
    private readonly groupMembershipService: GroupMembershipService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async calculateBalancesForGroup(groupId: number): Promise<
    {
      debtorId: string;
      creditorId: string;
      amount: number;
    }[]
  > {
    const expenses = await this.expenseRepository.find({
      where: { group: { id: groupId }, active: true },
      relations: ['paid_by', 'splits', 'splits.user'],
    });
    const groupMemberships = await this.groupMembershipService.findMembersByGroup(
      groupId,
    );
    const usersInGroup = groupMemberships.map((membership) => membership.user);
    const userBalances: { [userId: string]: number } = {};

    // Inicializar balances en 0 para todos los usuarios del grupo
    usersInGroup.forEach((user) => (userBalances[user.id] = 0));

    // Calcular contribuciones y deudas por cada gasto
    for (const expense of expenses) {
      const numberOfParticipants = expense.splits.filter((split) => split.active).length;
      const share = expense.amount / numberOfParticipants;
      const paidBy = expense.paid_by.id;

      userBalances[paidBy] += expense.amount; // El que paga adelanta el dinero

      for (const split of expense.splits) {
        if (split.active && split.user.id !== paidBy) {
          userBalances[split.user.id] -= share; // Los participantes deben su parte
        }
      }
    }

    // Generar la lista de balances finales entre pares de usuarios
    const finalBalances: {
      debtorId: string;
      creditorId: string;
      amount: number;
    }[] = [];
    const userIds = Object.keys(userBalances);

    for (let i = 0; i < userIds.length; i++) {
      for (let j = i + 1; j < userIds.length; j++) {
        const userAId = userIds[i];
        const userBId = userIds[j];

        const balanceA = userBalances[userAId] || 0;
        const balanceB = userBalances[userBId] || 0;

        const difference = balanceA + balanceB; // La suma debería ser cero si todo está bien

        if (difference > 0) {
          finalBalances.push({
            debtorId: userBId,
            creditorId: userAId,
            amount: difference,
          });
        } else if (difference < 0) {
          finalBalances.push({
            debtorId: userAId,
            creditorId: userBId,
            amount: Math.abs(difference),
          });
        }
      }
    }

    return finalBalances;
  }

}