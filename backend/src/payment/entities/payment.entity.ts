/* eslint-disable prettier/prettier */
// src/entities/payments.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column({ type: 'timestamp' })
  payment_date: Date;

  @Column({ type: 'int' })
  amount: number;

  @Column()
  status: 'accepted' | 'pending' | 'cancelled';

  @CreateDateColumn()
  created_at: Date;
}