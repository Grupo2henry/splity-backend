/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from '../user/entities/user.entity';

@Entity()
export class ExpenseSplit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Expense, (expense) => expense.splits)
  expense: Expense;

  @ManyToOne(() => User, (user) => user.splits)
  user: User;

  @Column({ default: true })
  active: boolean;

  @Column('float')
  amount_owed: number;
}
