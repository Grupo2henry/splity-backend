/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity'; // Asegúrate de que la ruta a la entidad sea correcta

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async findPayment(@Param('id') id: number): Promise<Payment | null | undefined> {
    return this.paymentService.findById(id);
  }

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Post('test')
  async test(@Body() body: any){
    console.log("Esto viene del front: ", body)
    return await body;
  }

  @Put(':id')
  async updatePayment(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto): Promise<Payment | undefined> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  async removePayment(@Param('id') id: number): Promise<void> {
    return this.paymentService.remove(id);
  }
}
