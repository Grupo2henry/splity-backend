/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ExpenseSplit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expense_id: number;

  @Column()
  user_id: number;

  @Column('decimal')
  amount_owed: number;
}