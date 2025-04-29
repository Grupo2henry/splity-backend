/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { User } from '../../user/entities/user.entity';
import { ExpenseSplit } from './expense-split.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.expenses)
  group: Group;

  @Column()
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column('float')
  amount: number;

  @ManyToOne(() => User, (user) => user.expensesPaid)
  paid_by: User;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ExpenseSplit, (split) => split.expense)
  splits: ExpenseSplit[];
}