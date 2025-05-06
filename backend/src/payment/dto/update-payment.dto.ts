/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  status?: 'accepted' | 'pending' | 'cancelled'; // <--- Tipo literal union, permite undefined implícitamente con IsOptional

  @IsOptional()
  @IsString()
  description?: string;

  // Otros campos que puedan ser actualizados
}