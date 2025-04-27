/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @Column()
  status: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  tier: string;

  @Column()
  started_at: Date;

  @Column()
  ends_at: Date;
}
