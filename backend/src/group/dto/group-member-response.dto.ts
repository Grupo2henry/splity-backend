/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class GroupMemberUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  active: boolean;
}

export class GroupMemberResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  joined_at: Date;

  @ApiProperty({ type: GroupMemberUserDto })
  user: GroupMemberUserDto;
}