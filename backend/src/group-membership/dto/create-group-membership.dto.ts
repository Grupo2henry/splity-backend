/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateGroupMembershipDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number; // Ajusta a string si los IDs de usuario son UUIDs

  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}