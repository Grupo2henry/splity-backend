/* eslint-disable prettier/prettier */
import { Expense } from 'src/entities/expense.entity';
import { ExpenseSplit } from 'src/entities/expense-split.entity';
import { Group } from 'src/group/entities/group.entity';
import { GroupMembership } from 'src/group/entities/group-membership.entity';
import { Payment } from 'src/entities/payments.entity';
import { Subscription } from 'src/entities/subscription.entity';
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

  @Column()
  password: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @Column({ default: false })
  is_premium: boolean;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @OneToMany(() => Group, (group) => group.created_by)
  groupsCreated: Group[];

  @OneToMany(() => GroupMembership, (gm) => gm.user)
  memberships: GroupMembership[];

  @OneToMany(() => Expense, (expense) => expense.paid_by)
  expensesPaid: Expense[];

  @OneToMany(() => ExpenseSplit, (split) => split.user)
  splits: ExpenseSplit[];

  @OneToMany(() => Subscription, (sub) => sub.user)
  subscriptions: Subscription[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
