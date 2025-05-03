/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('expenses')
  findAll(){
    console.log("Estoy en GET 'expenses")
    return this.expensesService.findAll();
  }

  @Get('/groups/:groupId/expenses')
  getExpenses(@Param('groupId') groupId: string) {
    return this.expensesService.getExpenses(groupId);
  }

  @Get('/expenses/:id')
  getExpense(@Param('id') id: string) {
    return this.expensesService.getExpense(id);
  }

  @Post('/groups/:groupId/expenses')
  createExpense(@Param('groupId') groupId: string, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.createExpense(Number(groupId), createExpenseDto);
  }

  @Put('/expenses/:id')
  updateExpense(@Param('id') id: string, @Body() updateData: Partial<CreateExpenseDto>) {
    return this.expensesService.updateExpense(id, updateData);
  }

  @Delete('/expenses/:id')
  deleteExpense(@Param('id') id: string) {
    return this.expensesService.deleteExpense(id);
  }
}