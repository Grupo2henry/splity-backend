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
  @MinLength(3)
  @MaxLength(80)
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
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
  @IsNotEmpty()
  @IsString()
  confirm_password: string;
  @IsNotEmpty()
  @IsString()
  username: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
