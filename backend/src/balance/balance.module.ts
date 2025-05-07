/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 Importa TypeOrmModule
import { ExpenseSplit } from '../expenses/entities/expense-split.entity'; // 👈 Importa la entidad ExpenseSplit
import { Expense } from '../expenses/entities/expense.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, ExpenseSplit]), // 👈 Importa TypeOrmModule.forFeature para ExpenseSplit
    UserModule,
    GroupModule,
    forwardRef(() => ExpensesModule),
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}