/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';
import { UserModule } from '../user/user.module';
import { BalanceModule } from '../balance/balance.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, ExpenseSplit]),
    UserModule,
    GroupModule,
    forwardRef(() => BalanceModule),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}