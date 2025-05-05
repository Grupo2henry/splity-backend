/* eslint-disable prettier/prettier */
// src/group/dto/create-group.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'f8c5d4b6-1c23-4a23-9b8c-6e8c5a33ef21' })
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @ApiProperty({ example: 'Viaje a Córdoba' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: ['uuid-user-1', 'uuid-user-2'] })
  @IsArray()
  @IsUUID('all', { each: true })
  participants: string[];
}