/* eslint-disable prettier/prettier */
//import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async findAll(): Promise<Subscription[]> {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Subscription> {
    return this.subscriptionService.findOne(id);
  }

  @Post()
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
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
  checkoutSubscription() {
    return { message: 'Checkout link generated: https://example.com/checkout' };
  }

  @Post('/webhook')
  webhook(@Body() body: any) {
    console.log(body);
    return { status: 'OK' };
  }
}
