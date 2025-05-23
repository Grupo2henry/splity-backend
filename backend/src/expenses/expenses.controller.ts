/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  // UseGuards,
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
// import { Roles } from 'src/auth/decorators/role.decorator';
// import { Role } from 'src/auth/enums/role.enum';
// import { RolesGuard } from 'src/auth/guards/role.guard';
import { GetExpensesDto } from './dto/get-expense.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

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

  @Patch('/expenses/:id')
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

  @Patch('/expenses/:id/toggle-active')
  @ApiOperation({
    summary: 'Toggle expense active status',
    description:
      'Modifies the active status of an expense (true to false, false to true)',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to toggle',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expense active status updated successfully',
    type: Expense,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expense not found',
  })
  async toggleActiveStatusExpense(@Param('id') id: string): Promise<Expense> {
    return this.expensesService.toggleActiveStatus(id);
  }
  @Auth(AuthType.None)
  // @Roles(Role.Admin) // inyecta rol a la metadata
  // @UseGuards(RolesGuard) // comprueba el rol requerido
  @Get('ExpensesOfGroup/:groupId')
  async getExpensesOfGroup(
    @Param('groupId') groupId: string,
    @Query() query: GetExpensesDto,
  ) {
    console.log(query);
    const gastos = await this.expensesService.getExpensesOfGroup(
      groupId,
      query,
    );
    console.log(gastos);
    return gastos;
  }
  @Auth(AuthType.None)
  @Get('adminExpensesGeneral')
  async getExpensesGeneralAdmin(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sinceAmount') sinceAmount?: string,
    @Query('untilAmount') untilAmount?: string,
    @Query('active') active?: string,
  ) {
    const activeFilter = active ? active === 'true' : undefined;
    const parsedSinceAmount = sinceAmount ? parseFloat(sinceAmount) : undefined;
    const parsedUntilAmount = untilAmount ? parseFloat(untilAmount) : undefined;
    return this.expensesService.findExpensesGeneral({
      page,
      limit,
      search,
      startDate,
      endDate,
      sinceAmount: parsedSinceAmount,
      untilAmount: parsedUntilAmount,
      active: activeFilter,
    });
  }
}
