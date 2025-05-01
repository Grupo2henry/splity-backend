/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionRepository } from './subscription.repository';
import { Payment } from 'src/payment/entities/payment.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Subscription, Payment]), // <--- Solo Subscription aquí
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
  exports: [SubscriptionService, SubscriptionRepository],
})
export class SubscriptionModule {}