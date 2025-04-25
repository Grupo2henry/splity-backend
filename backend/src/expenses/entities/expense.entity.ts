/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id: number;

  @Column()
  description: string;

  @Column('decimal')
  amount: number;

  @Column()
  paid_by: number;

  @CreateDateColumn()
  created_at: Date;
}