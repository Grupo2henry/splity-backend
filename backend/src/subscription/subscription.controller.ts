/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body } from '@nestjs/common';

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