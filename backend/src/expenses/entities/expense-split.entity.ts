/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from '../../user/entities/user.entity';

@Entity('expense_split')
export class ExpenseSplit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expense, (expense) => expense.splits, { onDelete: 'CASCADE' })
  expense: Expense;

  @ManyToOne(() => User, (user) => user.splits, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: true })
  active: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  amount_owed: number;
}
