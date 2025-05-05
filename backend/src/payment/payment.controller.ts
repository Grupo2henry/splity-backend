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
    console.log("Este es el user: ", user.name);
    console.log("Esto viene del front: ", paymentNotification);
    const { status, paymentId, preferenceId } = paymentNotification;

    try {
      const paymentDetails: MercadoPagoPaymentDetails | null = await this.mercadoPagoService.getPaymentDetails(paymentId);
      console.log('💰 Detalles del pago obtenidos de Mercado Pago (Nest.js):', paymentDetails);

      if (paymentDetails) {
        const createPaymentDto: CreatePaymentDto = {
          userId: user.id,
          amount: paymentDetails.transaction_amount,
          description: `Pago de Mercado Pago ID: ${paymentId}`, // Opcional: descripción
        };

        const newPayment = await this.paymentService.create({ createPaymentDto });

        return { message: 'Pago procesado y guardado', status, paymentId, preferenceId, paymentDetails, newPayment };
      } else {
        return { message: 'Pago procesado, pero no se pudieron obtener los detalles de Mercado Pago', status, paymentId, preferenceId };
      }
    } catch (error) {
      console.error('Error al obtener o guardar detalles del pago en Nest.js:', error);
      return { error: 'Error al procesar el pago' };
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
