/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  IsBoolean
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsUrl({}, { message: 'La URL de la imagen de perfil no es válida' })
  profile_picture_url?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsBoolean()
  is_premium?: boolean; // Agregado el campo is_premium
}