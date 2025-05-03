import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  paid_by: string;
}