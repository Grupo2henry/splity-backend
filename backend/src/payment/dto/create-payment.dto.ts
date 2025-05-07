/* eslint-disable prettier/prettier */
// src/payment/dto/create-payment.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Payment } from '../entities/payment.entity'; // Importa la entidad para usar los tipos

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  transaction_id?: string;

  @IsNotEmpty()
  @IsDateString()
  payment_date: Date;

  @IsNotEmpty()
  @IsEnum(['accepted', 'pending', 'cancelled'])
  status: Payment['status']; // Usamos el tipo de la entidad

  @IsOptional()
  @IsString()
  description?: string; // Aunque no está en la entidad, podría ser útil para logs o propósitos internos
}