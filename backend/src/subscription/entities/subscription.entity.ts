import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  status: 'active' | 'cancelled';

  @Column()
  tier: 'free' | 'premium';

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  ends_at: Date;
}