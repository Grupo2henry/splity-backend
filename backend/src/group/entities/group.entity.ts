/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { GroupMembership } from './group-membership.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('group')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => User, (user) => user.groups_created)
  created_by: User;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  emoji?: string;

  @Column({ nullable: true })
  locationName?: string; // Nombre o descripción, ej: "Parque Sarmiento"

  @Column('float', { nullable: true })
  latitude?: number;

  @Column('float', { nullable: true })
  longitude?: number;

  @OneToMany(() => GroupMembership, (gm) => gm.group)
  memberships: GroupMembership[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];

}