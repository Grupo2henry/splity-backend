/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateGroupMembershipDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  status?: string;
}