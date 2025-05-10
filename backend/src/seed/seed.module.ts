/* eslint-disable prettier/prettier */
// src/seed/seed.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { GroupMembership } from '../group/entities/group-membership.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { UserModule } from 'src/user/user.module';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { PaymentModule } from 'src/payment/payment.module';
import { GroupModule } from 'src/group/group.module';
import { AuthModule } from 'src/auth/auth.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

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
    AuthModule,
    UserModule,
    GroupModule,
    ExpensesModule,
    PaymentModule,
    SubscriptionModule
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
