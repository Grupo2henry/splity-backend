/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  status: 'active' | 'inactive';

  @IsNotEmpty()
  @IsDate()
  started_at: Date;

  @IsNotEmpty()
  @IsDate()
  ends_at: Date;

  @IsOptional()
  paymentId?: number;
}