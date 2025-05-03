/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])], // 👈 Agregado acá
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [TypeOrmModule.forFeature([Expense, ExpenseSplit])]
})
export class ExpensesModule {}