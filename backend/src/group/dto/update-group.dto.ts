/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}