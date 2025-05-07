/* eslint-disable prettier/prettier */

import { IsString, IsNumber, IsUUID, IsDateString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  paid_by: string;

  @IsOptional()
  @IsString()
  imgUrl: string;

  @IsDateString()
  date: string;
}