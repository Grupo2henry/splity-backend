/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Expense } from '../entities/expense.entity';
import { GroupResponseDto } from '../../group/dto/group-response.dto';
import { UserResponseDto } from '../../user/dto/response.user.dto';
import { ExpenseSplitResponseDto } from './expense-split-response.dto';

export class ExpenseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    type: GroupResponseDto,
    description: 'Grupo al que pertenece el gasto',
  })
  group: GroupResponseDto;

  @ApiProperty({ example: 'Cena con el equipo' })
  description: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: 55.75 })
  amount: number;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Usuario que pagó el gasto',
  })
  paid_by: UserResponseDto;

  @ApiProperty({ example: '2025-05-08T23:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-05-07T20:00:00.000Z' })
  date: Date;

  @ApiProperty({
    type: [ExpenseSplitResponseDto],
    description: 'Divisiones del gasto',
  })
  splits?: ExpenseSplitResponseDto[];

  @ApiProperty({ example: 'https://example.com/receipt.jpg', nullable: true })
  imgUrl: string | null;

  constructor(expense: Expense) {
    this.id = expense.id;
    this.group = new GroupResponseDto(expense.group);
    this.description = expense.description;
    this.active = expense.active;
    this.amount = expense.amount;
    this.paid_by = new UserResponseDto(expense.paid_by);
    this.created_at = expense.created_at;
    this.date = expense.date;
    this.splits = expense.splits ? expense.splits.map(split => new ExpenseSplitResponseDto(split)) : undefined;
    this.imgUrl = expense.imgUrl;
  }
}