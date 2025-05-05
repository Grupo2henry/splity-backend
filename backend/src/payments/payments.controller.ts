/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}
  @Post()
  async generatePayment(@Req() request: Request, @Body() body: any) {
    await this.paymentService.paymentLogic(request, body);
  }
}
