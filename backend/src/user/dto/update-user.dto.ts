/* eslint-disable prettier/prettier */
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUsuarioDto } from './create-usuario.dto';

// export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
// ../../user/dto/update-user.dto.ts

import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsUrl,
  MinLength,
} from 'class-validator';
import { Rol } from '../../auth/enums/role.enum';

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
  @IsBoolean()
  is_premium?: boolean;

  @IsOptional()
  @IsString()
  rol?: Rol;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
