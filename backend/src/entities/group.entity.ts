/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { GroupMembership } from './group.membership.entity';
import { Expense } from './expense.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => User, (user) => user.groupsCreated)
  created_by: User;

  @Column()
  created_at: Date;

  @OneToMany(() => GroupMembership, (gm) => gm.group)
  memberships: GroupMembership[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];
}
