/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity'; // Asegúrate de que la ruta a la entidad sea correcta
import { MercadoPagoService } from './mercadopago.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard/access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { PaymentNotificationDto } from './dto/payment-notification.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly mercadoPagoService: MercadoPagoService
  ) {}

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async findPayment(@Param('id') id: number): Promise<Payment | null | undefined> {
    return this.paymentService.findById(id);
  }

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Post('test')
  @UseGuards(AccessTokenGuard)
  async test(
    @Body() paymentNotification: PaymentNotificationDto,
    @Req() request: RequestWithUser,
  ) {
    const user = request[REQUEST_USER_KEY];
    const { status, paymentId, preferenceId } = paymentNotification;

    try {
      const paymentDetails = await this.mercadoPagoService.getPaymentDetails(paymentId);

      if (!paymentDetails) {
        return {
          message: 'No se pudieron obtener los detalles del pago de Mercado Pago',
          status,
          paymentId,
          preferenceId,
        };
      }

      const createPaymentDto: CreatePaymentDto = {
        userId: user.id,
        amount: paymentDetails.transaction_amount ?? 0,
        description: `Pago Mercado Pago ID: ${paymentId}`,
      };

      const payment = await this.paymentService.createFromMercadoPago({
        ...createPaymentDto,
        status: status as 'accepted' | 'pending' | 'cancelled',
        payment_date: new Date(paymentDetails.date_approved || paymentDetails.date_created),
      });

      console.log("Pago guardado en la base de datos: ", payment)

      return {
        message: 'Pago guardado correctamente',
        status,
        paymentId,
        preferenceId,
        payment,
      };
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      return { error: 'Error interno al procesar el pago' };
    }
  }

  @Put(':id')
  async updatePayment(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto): Promise<Payment | undefined> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  async removePayment(@Param('id') id: number): Promise<void> {
    return this.paymentService.remove(id);
  }
}
