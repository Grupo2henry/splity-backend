/* eslint-disable prettier/prettier */
// src/balance/balance.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './entities/balance.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { GroupMembershipService } from '../group/services/group-membership.service'; // Importa el GroupMembershipService

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    @Inject(GroupMembershipService) // Inyecta el GroupMembershipService
    private readonly groupMembershipService: GroupMembershipService,
  ) {}

  async updateBalancesAfterExpenseCreated(expense: Expense): Promise<void> {
    const group = expense.group;
    const paidBy = expense.paid_by;
    const groupMemberships = await this.groupMembershipService.findMembersByGroup(group.id);
    const participants = groupMemberships.map(membership => membership.user);
    const share = expense.amount / participants.length;

    for (const user of participants) {
      if (user.id !== paidBy.id) {
        // Verificar o crear el balance
        let balance = await this.balanceRepository.findOne({
          where: { group: { id: group.id }, debtor: { id: user.id }, creditor: { id: paidBy.id } },
        });

        if (balance) {
          balance.amount += share;
        } else {
          balance = this.balanceRepository.create({
            group,
            debtor: user,
            creditor: paidBy,
            amount: share,
          });
        }
        await this.balanceRepository.save(balance);

        // Considerar la dirección opuesta para normalizar (paidBy debe de user)
        const reverseBalance = await this.balanceRepository.findOne({
          where: { group: { id: group.id }, debtor: { id: paidBy.id }, creditor: { id: user.id } },
        });
        if (reverseBalance) {
          reverseBalance.amount -= share;
          await this.balanceRepository.save(reverseBalance);
        } else {
          const newReverseBalance = this.balanceRepository.create({
            group,
            debtor: paidBy,
            creditor: user,
            amount: -share,
          });
          await this.balanceRepository.save(newReverseBalance);
        }
      }
    }
  }

  async getBalancesByGroup(groupId: number): Promise<Balance[]> {
    return this.balanceRepository.find({
      where: { group: { id: groupId } },
      relations: ['debtor', 'creditor'], // Incluye la información de los usuarios relacionados
    });
  }

  async getBalancesByUserInGroup(userId: string, groupId: number): Promise<Balance[]> {
    return this.balanceRepository.find({
      where: [
        { group: { id: groupId }, debtor: { id: userId } },
        { group: { id: groupId }, creditor: { id: userId } },
      ],
      relations: ['debtor', 'creditor'], // Incluye la información de los usuarios relacionados
    });
  }

  async getAllBalancesByUser(userId: string): Promise<Balance[]> {
    return this.balanceRepository.find({
      where: [
        { debtor: { id: userId } },
        { creditor: { id: userId } },
      ],
      relations: ['group', 'debtor', 'creditor'], // Incluye la información del grupo y los usuarios
    });
  }

  async getAllBalances(): Promise<Balance[]> {
    return this.balanceRepository.find({
      relations: ['group', 'debtor', 'creditor'], // Incluye toda la información relacionada
    });
  }

  // Puedes agregar aquí las funciones para actualizar balances al editar/eliminar gastos
  // async updateBalancesAfterExpenseUpdated(expense: Expense): Promise<void> { ... }
  // async updateBalancesAfterExpenseDeleted(expense: Expense): Promise<void> { ... }
}