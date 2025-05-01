import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa TypeOrmModule
import { Payment } from './entities/payment.entity'; // Importa la entidad Payment
import { PaymentRepository } from './payment.repository'; // Importa el repositorio personalizado

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
