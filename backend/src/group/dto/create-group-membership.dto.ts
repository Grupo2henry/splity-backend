/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateGroupMembershipDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  userId: string; // Ajusta a string si los IDs de usuario son UUIDs

  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}