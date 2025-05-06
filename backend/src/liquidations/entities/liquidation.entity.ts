/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('liquidations')
export class Liquidation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  transaction_id: string;

  @CreateDateColumn()
  paid_at: Date;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column({ default: true })
  active: boolean;
}
