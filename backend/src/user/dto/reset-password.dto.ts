/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Matches, Length, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario que solicita el restablecimiento de contraseña.',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'El formato del email es inválido.' })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  email: string;

  @ApiProperty({
    description: 'La nueva contraseña para el usuario. Debe tener entre 8 y 15 caracteres y cumplir con los requisitos de seguridad.',
    example: 'NuevaPassword1!',
  })
  @IsNotEmpty({ message: 'La nueva contraseña no puede estar vacía.' })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto.' })
  @Length(8, 15, {
    message: 'La nueva contraseña debe tener entre 8 y 15 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message: 'La contraseña debe incluir al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*).',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmación de la nueva contraseña. Debe coincidir con newPassword.',
    example: 'NuevaPassword1!',
  })
  @IsNotEmpty({ message: 'La confirmación de la contraseña no puede estar vacía.' })
  @IsString({ message: 'La confirmación de la contraseña debe ser una cadena de texto.' })
  confirmNewPassword: string;
}