/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { MercadoPagoService } from './mp.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Pagos')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @ApiOperation({ summary: 'Crear preferencia de pago' })
  @ApiResponse({ status: 201, description: 'Preferencia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de pago inválidos' })
  @Auth(AuthType.None)
  @Post()
  async createPayment(@Body() paymentData: any) {
    try {
      const result =
        await this.mercadoPagoService.createPreference(paymentData);
      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        details: error.response?.data || null,
      };
    }
  }

  @ApiOperation({ summary: 'Endpoint para webhooks de MercadoPago' })
  @ApiResponse({ status: 200, description: 'Notificación procesada' })
  @ApiResponse({ status: 401, description: 'Firma no válida' })
  @Auth(AuthType.None)
  @Post('webhook')
  async handleWebhook(
    @Body() data: any,
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
  ) {
    console.log(`[${requestId}] Notificación recibida:`, data);

    // 1. Verificación de seguridad
    if (!this.verifySignature(signature, data)) {
      console.error(`[${requestId}] Firma no válida`);
      throw new UnauthorizedException('Firma de webhook no válida');
    }

    // 2. Procesamiento según tipo de evento
    switch (data.type) {
      case 'payment':
        await this.handlePaymentNotification(data.data.id);
        break;
      case 'subscription':
        await this.handleSubscriptionNotification(data.data.id);
        break;
      default:
        console.warn(
          `[${requestId}] Tipo de notificación no manejado:`,
          data.type,
        );
    }

    return { status: 'ok' };
  }

  private async handlePaymentNotification(paymentId: string) {
    console.log(`Procesando pago ${paymentId}`);
    // Implementar lógica para actualizar estado en tu base de datos
    // Ejemplo:
    // await this.paymentService.updatePaymentStatus(paymentId, 'completed');
  }

  private async handleSubscriptionNotification(subscriptionId: string) {
    console.log(`Procesando suscripción ${subscriptionId}`);
    // Lógica para manejar suscripciones
  }

  private verifySignature(signature: string, data: any): boolean {
    // Implementación básica (debes adaptarla a tu configuración)
    // En producción, usa el SDK de MercadoPago para verificar la firma
    if (process.env.NODE_ENV === 'development') {
      return true; // Skip verification in development
    }
    return !!signature; // Placeholder - implement proper verification
  }
}
