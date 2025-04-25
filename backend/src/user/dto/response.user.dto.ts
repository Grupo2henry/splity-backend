/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserResponseDto {
  @IsNotEmpty()
  id: string; // Asumiendo que el ID es un string (UUID)

  @MinLength(3)
  @MaxLength(80)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  created_at: Date;

  constructor(partial: Partial<UserResponseDto>) {
    this.id = partial.id ?? 'N/A';
    this.name = partial.name ?? 'Desconocido';
    this.email = partial.email ?? 'sin-email@example.com';
    this.created_at = partial.created_at ?? new Date();
  }
}
