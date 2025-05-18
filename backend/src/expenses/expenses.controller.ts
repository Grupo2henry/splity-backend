/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Expense } from './entities/expense.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { GetExpensesDto } from './dto/get-expense.dto';

@Controller()
@ApiTags('Expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('expenses')
  @ApiOperation({
    summary: 'Get all expenses',
    description: 'Retrieves a list of all expenses with their related data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of expenses retrieved successfully',
    type: [Expense],
  })
  async findAll(): Promise<Expense[]> {
    return this.expensesService.findAll();
  }

  @Get('/groups/:groupId/expenses')
  @ApiOperation({
    summary: 'Get group expenses',
    description: 'Retrieves all expenses for a specific group',
  })
  @ApiParam({
    name: 'groupId',
    description: 'The ID of the group',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Group expenses retrieved successfully',
    type: [Expense],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Group not found',
  })
  async getExpenses(@Param('groupId') groupId: string): Promise<Expense[]> {
    return this.expensesService.getExpenses(groupId);
  }

  @Get('/expenses/:id')
  @ApiOperation({
    summary: 'Get expense by ID',
    description: 'Retrieves a specific expense by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expense retrieved successfully',
    type: Expense,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expense not found',
  })
  async getExpense(@Param('id') id: string): Promise<Expense> {
    return this.expensesService.getExpense(id);
  }

  @Post('/groups/:groupId/expenses')
  @ApiOperation({
    summary: 'Create new expense',
    description: 'Creates a new expense for a specific group',
  })
  @ApiParam({
    name: 'groupId',
    description: 'The ID of the group',
    type: 'string',
  })
  @ApiBody({
    type: CreateExpenseDto,
    description: 'The expense data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expense created successfully',
    type: Expense,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid expense data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Group not found',
  })
  async createExpense(
    @Param('groupId') groupId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.createExpense(
      Number(groupId),
      createExpenseDto,
    );
  }

  @Put('/expenses/:id')
  @ApiOperation({
    summary: 'Update expense',
    description: 'Updates an existing expense',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to update',
    type: 'string',
  })
  @ApiBody({
    type: CreateExpenseDto,
    description: 'The updated expense data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expense updated successfully',
    type: Expense,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid expense data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expense not found',
  })
  async updateExpense(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateExpenseDto>,
  ): Promise<Expense> {
    return this.expensesService.updateExpense(id, updateData);
  }

  @Delete('/expenses/:id') //Debería solo poder ser eliminado por super admin
  @ApiOperation({
    summary: 'Delete expense',
    description: 'Deletes an existing expense',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to delete',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Expense deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expense not found',
  })
  async deleteExpense(@Param('id') id: string): Promise<void> {
    return this.expensesService.deleteExpense(id);
  }
  @Roles(Role.Admin) // inyecta rol a la metadata
  @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get('ExpensesOfGroup/:groupId')
  async getExpensesOfGroup(
    @Param('groupId') groupId: string,
    @Query() query: GetExpensesDto,
  ) {
    return this.expensesService.getExpensesOfGroup(groupId, query);
  }
}
