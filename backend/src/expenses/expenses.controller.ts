/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('expenses')
  @ApiOperation({
    summary: 'Devuelve todos los gastos registrados',
  })
  findAll(){
    console.log("Estoy en GET 'expenses")
    return this.expensesService.findAll();
  }

  @Get('/groups/:groupId/expenses')
  @ApiOperation({
    summary: 'Devuelve todos los gastos registrados de un grupo segun id del grupo en el parametro',
  })
  getExpenses(@Param('groupId') groupId: string) {
    return this.expensesService.getExpenses(groupId);
  }

  @Get('/expenses/:id')
  @ApiOperation({
    summary: 'Devuelve un gasto registrado segun id del grupo en el parametro',
  })
  getExpense(@Param('id') id: string) {
    return this.expensesService.getExpense(id);
  }

  @Post('/groups/:groupId/expenses')
  @ApiOperation({
    summary: 'Registra un gasto a un grupo segun id del grupo en el parametro',
  })
  createExpense(@Param('groupId') groupId: string, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.createExpense(Number(groupId), createExpenseDto);
  }

  @Put('/expenses/:id')
  @ApiOperation({
    summary: 'Actualiza un gasto segun id del gasto en el parametro',
  })
  updateExpense(@Param('id') id: string, @Body() updateData: Partial<CreateExpenseDto>) {
    return this.expensesService.updateExpense(id, updateData);
  }

  @Delete('/expenses/:id')
  @ApiOperation({
    summary: 'Borra un gasto segun id del gasto en el parametro',
  })
  deleteExpense(@Param('id') id: string) {
    return this.expensesService.deleteExpense(id);
  }
}