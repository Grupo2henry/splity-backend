/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  constructor(private readonly configService: ConfigService) {}

  async createPreference(paymentData: {
    title: string;
    quantity: number;
    unit_price: number;
    description?: string;
  }) {
    const accessTokenUser = this.configService.get<string>('ACCESS_TOKEN');
    const baseUrl = 'localhost:5173';
    if (accessTokenUser) {
      this.client = new MercadoPagoConfig({ accessToken: accessTokenUser }); // Asignarlo aquí
    } else {
      throw new Error('ACCESS_TOKEN no está configurado.');
    }

    // 1. Configuración ABSOLUTA de URLs (asegúrate que sean accesibles)
    const backUrls = {
      success: `${baseUrl}/payment-success`,
      failure: `${baseUrl}/payment-failure`,
      pending: `${baseUrl}/payment-pending`,
    };

    // 2. Validación EXPLÍCITA de las URLs
    if (!backUrls.success || !backUrls.failure || !backUrls.pending) {
      throw new Error('Todas las URLs de redirección deben estar definidas');
    }

    try {
      const preference = new Preference(this.client);

      // 3. Configuración COMPLETA y VALIDADA del request
      const requestBody = {
        items: [
          {
            id: uuidv4(),
            title: paymentData.title.substring(0, 256),
            quantity: Number(paymentData.quantity),
            unit_price: parseFloat(Number(paymentData.unit_price).toFixed(2)),
            currency_id: 'ARS',
            description: paymentData.description?.substring(0, 256) || '',
          },
        ],
        back_urls: backUrls,
        autoreturn: 'approved',
        payment_methods: {
          excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
          installments: 1,
          default_installments: 1,
        },
        notification_url: 'http://localhost:4000/payments/webhook',
      };

      const response = await preference.create({ body: requestBody });
      console.log('nuevoodsfsadfasdf');
      console.log('Preferencia creada:', response);

      return {
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
      };
    } catch (error) {
      console.error('Error detallado:', {
        message: error.message,
        status: error.status,
        errors: error.errors,
        stack: error.stack,
      });
      throw new Error(`Error al crear pago: ${error.message}`);
    }
  }
}
