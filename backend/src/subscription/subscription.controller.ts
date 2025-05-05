/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Req } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Controller()
export class SubscriptionController {
  @Get('/subscription')
  getSubscription() {
    return {
      id: 1,
      user_id: 2,
      status: 'active',
      tier: 'premium',
      started_at: new Date(),
      ends_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    };
  }
  @Post('/payments')
  getMe(@Req() request: Request) {
    try {
      const userPayload = request[REQUEST_USER_KEY];
      if (!userPayload) {
        return { message: 'Usuario no autenticado' };
      }
      console.log(userPayload);
      return userPayload;
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
      return { message: 'Error interno del servidor' };
    }
  }
  ///
  @Post('/subscription/checkout')
  checkoutSubscription() {
    return { message: 'Checkout link generated: https://example.com/checkout' };
  }

  @Post('/subscription/webhook')
  webhook(@Body() body: any) {
    console.log(body);
    return { status: 'OK' };
  }
}
