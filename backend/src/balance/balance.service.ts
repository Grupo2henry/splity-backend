/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/balance/balance.service.ts

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expenses/entities/expense.entity';
import { GroupMembershipService } from '../group/services/group-membership.service';
import { UserService } from '../user/user.service';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';
import { GroupMemberUserDto } from '../group/dto/group-member-response.dto';
import { ExpensesService } from '../expenses/expenses.service';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private readonly expenseSplitRepository: Repository<ExpenseSplit>,
    @Inject(forwardRef(() => GroupMembershipService))
    private readonly groupMembershipService: GroupMembershipService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly expensesService: ExpensesService,
  ) {}

  async calculateBalancesForGroup(groupId: number): Promise<
    {
      debtorId: string;
      creditorId: string;
      amount: number;
    }[]
  > {
    const expenses = await this.expensesService.getExpenses(String(groupId));
    const groupMemberships = await this.groupMembershipService.findMembersByGroup(
      groupId,
    );
    const usersInGroup = groupMemberships.map((membership) => membership.user);
    const userBalances: { [userId: string]: number } = {};

    // Inicializar balances en 0 para todos los usuarios del grupo
    usersInGroup.forEach((user) => (userBalances[user.id] = 0));

    // Calcular contribuciones y deudas por cada gasto
    for (const expense of expenses) {
      const activeSplits = expense.splits.filter((split) => split.active);
      const numberOfParticipants = activeSplits.length;
      if (numberOfParticipants === 0) continue; // Skip if no active participants

      const share = expense.amount / numberOfParticipants;
      const paidBy = expense.paid_by.id;

      userBalances[paidBy] += expense.amount; // El que paga adelanta el dinero

      for (const split of activeSplits) {
        if (split.user.id !== paidBy) {
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

  async calculateEqualDivision(groupId: number): Promise<{
    balanceByUser: {
      userId: string;
      name: string;
      balance: number;
    }[];
    recommendedLiquidations: {
      debtorId: string;
      debtorName: string;
      creditorId: string;
      creditorName: string;
      amount: number;
    }[];
  }> {
    const expenses = await this.expensesService.getExpenses(String(groupId));

    const groupMemberships = await this.groupMembershipService.findMembersByGroup(groupId);
    const usersInGroup = groupMemberships.map((m) => m.user);
    const numberOfMembers = usersInGroup.length;

    const userBalances: { [userId: string]: number } = {};
    const usersMap: Map<string, GroupMemberUserDto> = new Map(usersInGroup.map((u) => [u.id, u]));

    usersInGroup.forEach((user) => {
      userBalances[user.id] = 0;
    });

    for (const expense of expenses) {
      const share = expense.amount / numberOfMembers;
      // 👇 Seguridad adicional para verificar si expense.paid_by existe
      if (expense.paid_by && expense.paid_by.id) {
        const payerId = expense.paid_by.id;
        userBalances[payerId] += expense.amount;
        for (const user of usersInGroup) {
          userBalances[user.id] -= share;
        }
      } else {
        // Si no hay paid_by, ignorar este gasto
        console.warn(`Expense with ID ${expense.id} has no 'paid_by' information. Ignoring expense.`);
        continue; // Saltar a la siguiente iteración del bucle
      }
    }

    const balanceByUser = usersInGroup.map((user) => ({
      userId: user.id,
      name: user.name,
      balance: parseFloat(userBalances[user.id].toFixed(2)),
    }));

    const creditors = balanceByUser
      .filter((u) => u.balance > 0)
      .map((u) => ({ ...u }))
      .sort((a, b) => b.balance - a.balance);
    const debtors = balanceByUser
      .filter((u) => u.balance < 0)
      .map((u) => ({ ...u }))
      .sort((a, b) => a.balance - b.balance); // más negativo primero

    const recommendedLiquidations: {
      debtorId: string;
      debtorName: string;
      creditorId: string;
      creditorName: string;
      amount: number;
    }[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(-debtor.balance, creditor.balance);
      if (amount > 0.01) {
        recommendedLiquidations.push({
          debtorId: debtor.userId,
          debtorName: debtor.name,
          creditorId: creditor.userId,
          creditorName: creditor.name,
          amount: parseFloat(amount.toFixed(2)),
        });

        debtor.balance += amount;
        creditor.balance -= amount;
      }

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (creditor.balance < 0.01) j++;
      console.log(balanceByUser);
    }

    return {
      balanceByUser,
      recommendedLiquidations,
    };
  }
}