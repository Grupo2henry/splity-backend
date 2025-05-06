/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  /**
   * Correo electrónico del usuario.
   * @example "juan.perez@email.com"
   */
  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsEmail()
  email: string;

  /**
   * Contraseña del usuario.
   * @example "Password1@"
   */
  @ApiProperty({ example: 'Password1@' })
  @IsString()
  @MinLength(6)
  password: string;
}
