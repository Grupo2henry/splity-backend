/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
// src/payment/mercadopago.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoConfig, Payment as PaymentResource } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private readonly payment: PaymentResource;

  constructor() {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    this.payment = new PaymentResource(client);
  }

  async getPaymentDetails(paymentId: string): Promise<any | null> {
    try {
      const paymentInfo = await this.payment.get({ id: paymentId });

      if (!paymentInfo || !paymentInfo.id) {
        throw new NotFoundException(`No se encontró el pago con ID ${paymentId}`);
      }

      return paymentInfo;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al obtener los detalles del pago de Mercado Pago:', error.message);
      } else {
        console.error('Error desconocido al obtener los detalles del pago de Mercado Pago');
      }
      return null;
    }
  }
}

