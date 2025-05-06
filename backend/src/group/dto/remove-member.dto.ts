/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveMembersDto {
  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  userIds: number[];
}