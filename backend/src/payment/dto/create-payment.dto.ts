/* eslint-disable prettier/prettier */
// src/payment/dto/create-payment.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: 'accepted' | 'pending' | 'cancelled';

  @IsOptional()
  @IsDateString()
  payment_date?: Date;
}
