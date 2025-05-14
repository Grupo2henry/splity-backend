/* eslint-disable prettier/prettier */
// src/group/dto/create-group.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Viaje a Córdoba' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: ['uuid-user-1', 'uuid-user-2'] })
  @IsArray()
  @IsUUID('all', { each: true })
  participants: string[];

  @ApiProperty({ example: '✈️', required: false })
  @IsOptional() // Marca el emoji como opcional
  @IsString()
  emoji?: string;
}