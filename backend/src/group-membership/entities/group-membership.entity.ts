/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from '../../group/entities/group.entity';

@Entity()
export class GroupMembership {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @ManyToOne(() => Group, (group) => group.memberships)
  group: Group;

  @Column({ default: true })
  active: boolean;

  @Column()
  joined_at: Date;

  @Column()
  status: string;
}
