/* eslint-disable prettier/prettier */
// src/subscription/subscription.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriptionRepository extends Repository<Subscription> {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {
    super(
      subscriptionRepository.target,
      subscriptionRepository.manager,
      subscriptionRepository.queryRunner,
    );
  }

  async findActiveSubscriptionsByUser(userId: string): Promise<Subscription[]> {
    return this.createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user')
      .leftJoinAndSelect('subscription.payment', 'payment')
      .where('user.id = :userId', { userId })
      .andWhere('subscription.status = :status', { status: 'active' })
      .getMany();
  }

}