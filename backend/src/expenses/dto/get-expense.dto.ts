import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetExpensesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 6;

  @IsOptional()
  @IsString()
  search?: string = '';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sinceAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  untilAmount?: number;
}
