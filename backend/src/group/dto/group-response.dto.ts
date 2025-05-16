/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../entities/group.entity';
import { UserResponseDto } from '../../user/dto/response-user.dto';
import { GroupMembershipResponseDto } from './group-membership-response.dto';
import { ExpenseResponseDto } from '../../expenses/dto/expense-response.dto';

export class GroupResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Viaje a Córdoba' })
  name: string;

  @ApiProperty({ example: '✨' }) // Ejemplo de un emoji
  emoji?: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Usuario que creó el grupo',
  })
  created_by: UserResponseDto;

  @ApiProperty({ example: '2024-05-08T22:45:00.000Z' })
  created_at: Date;

  @ApiProperty({
    type: [GroupMembershipResponseDto],
    description: 'Membresías del grupo',
  })
  memberships?: GroupMembershipResponseDto[];

  @ApiProperty({
    type: [ExpenseResponseDto],
    description: 'Gastos asociados al grupo',
  })
  expenses?: ExpenseResponseDto[];

  constructor(group: Group) {
    this.id = group.id;
    this.name = group.name;
    this.emoji = group.emoji; // Asignamos el emoji desde la entidad
    this.active = group.active;
    this.created_by = new UserResponseDto(group.created_by);
    this.created_at = group.created_at;
    this.memberships = group.memberships ? group.memberships.map(gm => new GroupMembershipResponseDto(gm)) : undefined;
    this.expenses = group.expenses ? group.expenses.map(expense => new ExpenseResponseDto(expense)) : undefined;
  }
}