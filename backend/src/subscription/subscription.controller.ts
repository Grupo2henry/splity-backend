/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
<<<<<<< HEAD
import { Controller, Get, Post, Body, Put, Req } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
=======
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
>>>>>>> origin/develop

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async findAll(): Promise<Subscription[]> {
    return this.subscriptionService.findAll();
  }
<<<<<<< HEAD
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
=======

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Subscription> {
    return this.subscriptionService.findOne(id);
  }

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.subscriptionService.remove(id);
  }

  @Post('/checkout')
>>>>>>> origin/develop
  checkoutSubscription() {
    return { message: 'Checkout link generated: https://example.com/checkout' };
  }

  @Post('/webhook')
  webhook(@Body() body: any) {
    console.log(body);
    return { status: 'OK' };
  }
}
