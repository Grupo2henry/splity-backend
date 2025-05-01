/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsString()
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsDate()
  started_at?: Date;

  @IsOptional()
  @IsDate()
  ends_at?: Date;

  @IsOptional()
  paymentId?: number;
}