import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoService } from './mp.service';
import { PaymentsController } from './mp.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentsController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
