/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule
import { Payment } from './entities/payment.entity'; // Importa la entidad Payment
import { PaymentRepository } from './payment.repository'; // Importa el repositorio personalizado
import { MercadoPagoService } from './mercadopago.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]),
  UserModule,
  AuthModule,
  JwtModule,
  SubscriptionModule,
  ConfigModule.forFeature(jwtConfig)
],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, MercadoPagoService],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
