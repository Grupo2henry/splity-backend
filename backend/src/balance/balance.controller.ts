/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('groups/:groupId/balances')
  @ApiOperation({
    summary: 'Devuelve un listado esta de balance por usuario del grupo y pagos recomendados',
  })
  async getBalancesByGroup(@Param('groupId') groupId: number) {
    return this.balanceService.calculateBalancesForGroup(groupId);
  }

  @Get('groups/:groupId/equal-division')
  @ApiOperation({
    summary: 'Devuelve un listado esta de balance por usuario del grupo y pagos recomendados',
  })
  async getEqualDivisionByGroup(@Param('groupId') groupId: number){
    return this.balanceService.calculateEqualDivision(groupId);
  }
}