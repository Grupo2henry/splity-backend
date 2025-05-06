/* eslint-disable prettier/prettier */
// src/entities/payments.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
  
  @Column()
  status: 'accepted' | 'pending' | 'cancelled';
  
  @Column({ nullable: true })
  transaction_id: string;

  @Column({ type: 'timestamp' })
  payment_date: Date;
  
  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column({ default: true })
  active: boolean;
}