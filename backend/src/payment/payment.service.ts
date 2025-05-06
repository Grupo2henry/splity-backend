/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findById(id: number): Promise<Payment | null | undefined> {
    return this.paymentRepository.findOne({ where: { id } });
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { userId, amount, status, payment_date, transaction_id } = createPaymentDto;

    const payment = this.paymentRepository.create({
      user: { id: userId } as User,
      amount,
      status,
      payment_date,
      transaction_id,
      active: true, // Establecemos active por defecto al crear
    });

    return this.paymentRepository.save(payment);
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment | undefined> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    this.paymentRepository.merge(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }

  // Ejemplo de uso del método personalizado (se mantiene sin cambios si es necesario)
  async getAcceptedPaymentsByUser(userId: number): Promise<Payment[]> {
    return this.paymentRepository.findAcceptedPaymentsByUser(userId);
  }
}