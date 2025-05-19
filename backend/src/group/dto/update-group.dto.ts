/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsBoolean, IsArray, IsUUID, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupDto {
  @ApiProperty({ example: 'Viaje a las Sierras', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: ['uuid-user-3', 'uuid-user-4'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  participants?: string[];

  @ApiProperty({ example: '⛰️', required: false })
  @IsOptional()
  @IsString()
  emoji?: string;

  @ApiProperty({ example: 'Villa Carlos Paz', required: false })
  @IsOptional()
  @IsString()
  locationName?: string;

  @ApiProperty({ example: -31.4167, required: false })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ example: -64.5000, required: false })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}