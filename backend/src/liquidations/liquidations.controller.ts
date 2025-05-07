/* eslint-disable prettier/prettier */
import { Controller, Post } from '@nestjs/common';
import { LiquidationsService } from './liquidations.service';

@Controller('liquidations')
export class LiquidationsController {
  constructor(private readonly liquidationsService: LiquidationsService) {}
  @Post()
  generateLiquidation() {
    return {message: "Mensaje de liquidacion"}
  }
}
