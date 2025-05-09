/* eslint-disable prettier/prettier */
import { Role } from '../../auth/enums/role.enum';
import { Expense } from '../../expenses/entities/expense.entity';
import { ExpenseSplit } from '../../expenses/entities/expense-split.entity';
import { Group } from '../../group/entities/group.entity';
import { GroupMembership } from '../../group/entities/group-membership.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true, type: 'varchar', length: 96 })
  password?: string;

  @Column({ nullable: true, type: 'varchar' })
  google_id?: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @Column({ default: false })
  is_premium: boolean;

  @Column({ default: Role.User })
  role: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Group, (group) => group.created_by)
  groups_created: Group[];

  @OneToMany(() => GroupMembership, (gm) => gm.user)
  memberships: GroupMembership[];

  @OneToMany(() => Expense, (expense) => expense.paid_by)
  expenses_paid: Expense[];

  @OneToMany(() => ExpenseSplit, (split) => split.user)
  splits: ExpenseSplit[];

  @OneToMany(() => Subscription, (sub) => sub.user)
  subscriptions: Subscription[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @Column({ default: 0 }) // Nueva columna para el total de grupos creados
  total_groups_created: number;
}