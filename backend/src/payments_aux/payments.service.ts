/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  async paymentLogic(request: Request, @Body() body: any) {
    try {
      const userPayload = request[REQUEST_USER_KEY];
      if (!userPayload && !userPayload.id) {
        return { message: 'Usuario no autenticado' };
      }
      const user = await this.userRepository.findOne({
        where: { id: userPayload.id },
      });
      if (!user) {
        return { message: 'Usuario no encontrado' };
      }
      console.log('user de payment', user);
      const { amount, status, transaction_id, paid_at } = body;

      const payment = this.paymentRepository.create({
        amount: amount,
        status: status,
        transaction_id: transaction_id,
        paid_at: paid_at,
        user: user,
        active: true,
      });
      await this.paymentRepository.save(payment);
      return payment;
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
      return { message: 'Error interno del servidor' };
    }
  }
}
