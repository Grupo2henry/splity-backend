/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { GroupMembership } from '../entities/group-membership.entity';
import { UserResponseDto } from '../../user/dto/response-user.dto';
import { GroupResponseDto } from './group-response.dto';
import { GroupRole } from '../enums/group-role.enum';

export class GroupMembershipResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Usuario miembro del grupo',
  })
  user: UserResponseDto;

  @ApiProperty({
    type: GroupResponseDto,
    description: 'Grupo al que pertenece la membresía',
  })
  group: GroupResponseDto;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: '2025-05-08T22:55:00.000Z' })
  joined_at: Date;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ enum: GroupRole, default: GroupRole.MEMBER })
  role: GroupRole;

  constructor(groupMembership: GroupMembership) {
    this.id = groupMembership.id;
    this.user = new UserResponseDto(groupMembership.user);
    this.group = new GroupResponseDto(groupMembership.group);
    this.active = groupMembership.active;
    this.joined_at = groupMembership.joined_at;
    this.status = groupMembership.status;
    this.role = groupMembership.role;
  }
}