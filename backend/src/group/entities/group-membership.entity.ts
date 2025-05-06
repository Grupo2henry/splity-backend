/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from './group.entity';
import { GroupRole } from '../enums/group-role.enum';

@Entity('group_membership')
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

  @Column({
    type: 'enum',
    enum: GroupRole,
    default: GroupRole.MEMBER,
  })
  role: GroupRole;
}