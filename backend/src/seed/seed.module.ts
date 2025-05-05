/* eslint-disable prettier/prettier */
// src/seed/seed.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { GroupMembership } from '../group/entities/group-membership.entity';
<<<<<<< HEAD
import { Expense } from '../entities/expense.entity';
import { ExpenseSplit } from '../entities/expense-split.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { Subscription } from '../entities/subscription.entity';
=======
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
>>>>>>> origin/develop

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Group,
      GroupMembership,
      Expense,
      ExpenseSplit,
      Payment,
      Subscription,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
