/* eslint-disable prettier/prettier */
// src/balance/entities/balance.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, UpdateDateColumn } from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { User } from '../../user/entities/user.entity';

@Entity('balances')
@Unique(['group', 'debtor', 'creditor']) // Un balance único por par de usuarios en un grupo
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.balances)
  group: Group;

  @ManyToOne(() => User, (user) => user.balancesOwed)
  debtor: User; // Usuario que debe dinero

  @ManyToOne(() => User, (user) => user.balancesOwing)
  creditor: User; // Usuario al que se le debe dinero

  @Column('float', { default: 0 })
  amount: number; // Cantidad adeudada (positivo si debtor debe a creditor)

  // Opcional: Fecha de la última actualización del balance
  @UpdateDateColumn()
  updated_at: Date;
}