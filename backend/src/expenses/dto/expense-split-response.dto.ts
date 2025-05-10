/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseSplit } from '../entities/expense-split.entity';
import { UserResponseDto } from '../../user/dto/response-user.dto';
import { ExpenseResponseDto } from './expense-response.dto';

export class ExpenseSplitResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    type: ExpenseResponseDto,
    description: 'Gasto al que pertenece esta división',
  })
  expense: ExpenseResponseDto;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Usuario al que se aplica esta división',
  })
  user: UserResponseDto;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: 25.50 })
  amount_owed: number;

  constructor(expenseSplit: ExpenseSplit) {
    this.id = expenseSplit.id;
    this.expense = new ExpenseResponseDto(expenseSplit.expense);
    this.user = new UserResponseDto(expenseSplit.user);
    this.active = expenseSplit.active;
    this.amount_owed = expenseSplit.amount_owed;
  }
}