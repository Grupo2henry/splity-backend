/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { User } from '../user/entities/user.entity';
import { SubscriptionService } from '../subscription/subscription.service'; // Importa el SubscriptionService

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    @Inject(SubscriptionService) // Inyecta el SubscriptionService
    private readonly subscriptionService: SubscriptionService,
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

    const savedPayment = await this.paymentRepository.save(payment);

    // Si el pago es aceptado, crea una nueva suscripción
    if (savedPayment.status === 'accepted') {
      // Define los datos necesarios para crear la suscripción
      // ¡Importante! Ajusta estos valores según la lógica de tu aplicación
      const subscriptionData = {
        userId: userId.toString(), // Asegúrate de que userId sea un string si es necesario
        status: 'active' as 'active' | 'inactive', // Establece el estado inicial de la suscripción
        started_at: new Date(), // Puedes definir la fecha de inicio según tu lógica
        ends_at: this.calculateSubscriptionEndDate(), // Implementa esta función según la duración de tu suscripción
        paymentId: savedPayment.id, // Asocia el pago a la suscripción
      };

      try {
        await this.subscriptionService.create(subscriptionData);
        console.log(`[PaymentService] Subscripción creada para el usuario ${userId} tras pago aceptado.`);
      } catch (error) {
        console.error('[PaymentService] Error al crear la subscripción:', error);
        // Considera si quieres revertir el pago o manejar el error de otra manera
      }
    }

    return savedPayment;
  }

  // Función para calcular la fecha de fin de la suscripción (fijo a un año)
  private calculateSubscriptionEndDate(): Date {
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    return endDate;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment | undefined> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    this.paymentRepository.merge(payment, updatePaymentDto);
    const updatedPayment = await this.paymentRepository.save(payment);

    if (updatedPayment.status === 'accepted') {
      const activeSubscriptions = await this.subscriptionService.findActiveByUser(updatedPayment.user.id.toString());
      if (activeSubscriptions.length === 0) {
        const subscriptionData = {
          userId: updatedPayment.user.id.toString(),
          status: 'active' as 'active' | 'inactive',
          started_at: new Date(),
          ends_at: this.calculateSubscriptionEndDate(),
          paymentId: updatedPayment.id,
        };
        try {
          await this.subscriptionService.create(subscriptionData);
          console.log(`[PaymentService] Subscripción creada para el usuario ${updatedPayment.user.id} tras actualización de pago a aceptado.`);
        } catch (error) {
          console.error('[PaymentService] Error al crear la subscripción tras actualización de pago:', error);
        }
      }
    }

    return updatedPayment;
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }

  async getAcceptedPaymentsByUser(userId: number): Promise<Payment[]> {
    return this.paymentRepository.findAcceptedPaymentsByUser(userId);
  }
}