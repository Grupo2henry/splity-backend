/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from 'src/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])], // 👈 Agregado acá
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}