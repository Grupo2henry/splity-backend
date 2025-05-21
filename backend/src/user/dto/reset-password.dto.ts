/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
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
    description: 'La nueva contraseña para el usuario. Debe tener al menos 6 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
    example: 'NuevaContrasena123!',
  })
  @IsNotEmpty({ message: 'La nueva contraseña no puede estar vacía.' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres.' })
  // Puedes añadir una regex más robusta según tus requisitos de seguridad
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmación de la nueva contraseña. Debe coincidir con newPassword.',
    example: 'NuevaContrasena123!',
  })
  @IsNotEmpty({ message: 'La confirmación de la contraseña no puede estar vacía.' })
  // Nota: La validación de que newPassword y confirmPassword coincidan
  // se hará en el controlador, no directamente con un decorador aquí.
  confirmNewPassword: string;
}