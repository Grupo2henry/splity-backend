/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private readonly client: MercadoPagoConfig;
  private readonly payment: Payment;

  constructor() {
    this.client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! }); // Asegúrate de tener esta env var
    this.payment = new Payment(this.client);
  }

  async getPaymentDetails(paymentId: string) {
    try {
      const paymentInfo = await this.payment.get({ id: paymentId });
      if(!paymentInfo) return "Error"
      return paymentInfo;
    } catch (error) {
      console.error('Error fetching payment details from Mercado Pago API (Nest.js):', error);
      throw error;
    }
  }
}