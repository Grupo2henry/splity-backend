/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Group } from '../group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { ExpenseSplit } from './expense.split.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.expenses)
  group: Group;

  @Column()
  descripcion: string;

  @Column({ default: true })
  active: boolean;

  @Column('float')
  monto: number;

  @ManyToOne(() => User, (user) => user.expensesPaid)
  pagado_por: User;

  @Column()
  created_at: Date;

  @OneToMany(() => ExpenseSplit, (split) => split.expense)
  splits: ExpenseSplit[];
}
