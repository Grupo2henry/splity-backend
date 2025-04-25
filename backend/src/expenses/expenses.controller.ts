/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';

@Controller()
export class ExpensesController {
  @Get('/groups/:groupId/expenses')
  getExpenses(@Param('groupId') groupId: string) {
    return [
      {
        id: 1,
        group_id: parseInt(groupId),
        description: 'Dinner',
        amount: 50.0,
        paid_by: 2,
        created_at: new Date(),
      },
    ];
  }

  @Get('/expenses/:id')
  getExpense(@Param('id') id: string) {
    return {
      id: parseInt(id),
      group_id: 1,
      description: 'Dinner',
      amount: 50.0,
      paid_by: 2,
      created_at: new Date(),
      splits: [
        { id: 1, expense_id: parseInt(id), user_id: 3, amount_owed: 25.0 },
        { id: 2, expense_id: parseInt(id), user_id: 4, amount_owed: 25.0 },
      ],
    };
  }

  @Post('/groups/:groupId/expenses')
  createExpense(@Param('groupId') groupId: string) {
    return { message: `Expense created for group ${groupId}` };
  }

  @Put('/expenses/:id')
  updateExpense(@Param('id') id: string) {
    return { message: `Expense ${id} updated` };
  }

  @Delete('/expenses/:id')
  deleteExpense(@Param('id') id: string) {
    return { message: `Expense ${id} deleted` };
  }
}