/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Payment } from '../payment/entities/payment.entity';
import { SubscriptionRepository } from './subscription.repository';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      relations: ['subscriptions'],
    });

    if (!user) throw new NotFoundException('User not found');

    const hasActive = user.subscriptions?.some(
      (sub) => sub.active && (!sub.ends_at || new Date(sub.ends_at) > new Date()),
    );

    if (hasActive) {
      throw new ConflictException('User already has an active subscription');
    }

    let payment: Payment | null = null;
    if (dto.paymentId) {
      payment = await this.paymentRepository.findOneBy({ id: dto.paymentId });
      if (!payment) throw new NotFoundException('Payment not found');
    }

    const subscription = this.subscriptionRepository.create({
      user,
      status: dto.status,
      active: dto.status === 'active',
      started_at: dto.started_at,
      ends_at: dto.ends_at,
      payment: payment ?? undefined,
    });

    const savedSubscription = await this.subscriptionRepository.save(subscription);

    // Marcar al usuario como premium
    await this.userService.update(user.id, { is_premium: true });

    return savedSubscription;
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      relations: ['user', 'payment'],
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const sub = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'payment'],
    });
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  async update(
    id: number,
    dto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);

    if (dto.status) {
      subscription.status = dto.status;
      subscription.active = dto.status === 'active';
    }
    if (dto.started_at) subscription.started_at = dto.started_at;
    if (dto.ends_at) subscription.ends_at = dto.ends_at;

    if (dto.paymentId !== undefined) {
      const payment = await this.paymentRepository.findOneBy({ id: dto.paymentId });
      if (!payment) throw new NotFoundException('Payment not found');
      subscription.payment = payment;
    }

    return this.subscriptionRepository.save(subscription);
  }

  async remove(id: number): Promise<void> {
    const result = await this.subscriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Subscription not found');
    }
  }

  async findActiveByUser(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.findActiveSubscriptionsByUser(userId);
  }
}