/* eslint-disable prettier/prettier */
// src/payment/repositories/payment.repository.ts
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentRepository extends Repository<Payment> {
  constructor(@InjectRepository(Payment) repository: Repository<Payment>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAcceptedPaymentsByUser(userId: number): Promise<Payment[]> {
    return this.createQueryBuilder('payment')
      .where('payment.user.id = :userId', { userId })
      .andWhere('payment.status = :status', { status: 'accepted' })
      .orderBy('payment.payment_date', 'DESC')
      .getMany();
  }

  // Otros métodos personalizados...
}