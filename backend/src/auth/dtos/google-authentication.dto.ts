/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @IsNotEmpty()
  token: string;
}
