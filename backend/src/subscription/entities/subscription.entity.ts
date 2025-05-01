/* eslint-disable prettier/prettier */
// src/subscription/entities/subscription.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../entities/payments.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @Column()
  status: 'active' | 'inactive';

  @Column({ default: true })
  active: boolean;

  @Column()
  started_at: Date;

  @Column()
  ends_at: Date;

  @OneToOne(() => Payment, { nullable: true })
  @JoinColumn()
  payment?: Payment;
}

