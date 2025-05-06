/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 Importa TypeOrmModule
import { ExpenseSplit } from '../expenses/entities/expense-split.entity'; // 👈 Importa la entidad ExpenseSplit

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseSplit]), // 👈 Importa TypeOrmModule.forFeature para ExpenseSplit
    UserModule,
    GroupModule,
    ExpensesModule,
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}