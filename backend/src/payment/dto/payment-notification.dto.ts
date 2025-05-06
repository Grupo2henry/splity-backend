/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class PaymentNotificationDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsString()
  @IsNotEmpty()
  preferenceId: string;
}