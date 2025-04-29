import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * El nombre del usuario.
   * @example "Juan Pérez"
   */
  @ApiProperty({ example: 'Juan Pérez' })
  @MinLength(3)
  @MaxLength(80)
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * El correo electrónico del usuario.
   * @example "juan.perez@email.com"
   */
  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * La contraseña del usuario.
   * @example "Password1@"
   */
  @ApiProperty({ example: 'Password1@' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe incluir al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*).',
  })
  password: string;

  /**
   * La confirmación de la contraseña.
   * @example "Password1@"
   */
  @ApiProperty({ example: 'Password1@' })
  @IsNotEmpty()
  @IsString()
  confirm_password: string;

  /**
   * El nombre de usuario.
   * @example "juanperez123"
   */
  @ApiProperty({ example: 'juanperez123' })
  @IsNotEmpty()
  @IsString()
  username: string;

  /**
   * Constructor para asignar valores parciales al DTO.
   * @param partial Objeto parcial de tipo CreateUserDto.
   */
  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
