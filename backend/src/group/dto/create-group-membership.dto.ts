/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { GroupRole } from '../enums/group-role.enum';

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

  @IsOptional()
  @IsEnum(GroupRole, {
    message: `El rol debe ser uno de: ${Object.values(GroupRole).join(', ')}`,
  })
  role?: GroupRole; // Opcional: si no se envía, se tomará el valor por defecto en la entidad
}