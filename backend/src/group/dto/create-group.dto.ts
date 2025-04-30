import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';

export class CreateGroupDto {
  /**
   * Nombre del creador del grupo.
   * @example "Juan Pérez"
   */
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  creatorName: string;

  /**
   * Nombre del evento.
   * @example "Cumpleaños de Pedro"
   */
  @ApiProperty({ example: 'Cumpleaños de Pedro' })
  @IsNotEmpty()
  @IsString()
  eventName: string;

  /**
   * Lista de participantes.
   * @example ["María", "Carlos", "Ana"]
   */
  @ApiProperty({ example: ['María', 'Carlos', 'Ana'] })
  @IsArray()
  @IsString({ each: true })
  participants: string[];

  /**
   * Tipo de moneda.
   * @example "pesos"
   */
  @ApiProperty({ example: 'pesos' })
  @IsNotEmpty()
  @IsEnum(['pesos', 'dolares'], {
    message: "La moneda debe ser 'pesos' o 'dolares'.",
  })
  currency: 'pesos' | 'dolares';
}
