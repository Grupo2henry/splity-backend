/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('group/:groupId')
  async getBalancesByGroup(@Param('groupId') groupId: number) {
    return this.balanceService.getBalancesByGroup(groupId);
  }

  @Get('user/:userId/group/:groupId')
  async getBalancesByUserInGroup(
    @Param('userId') userId: string,
    @Param('groupId') groupId: number,
  ) {
    return this.balanceService.getBalancesByUserInGroup(userId, groupId);
  }

  @Get('user/:userId')
  async getAllBalancesByUser(@Param('userId') userId: string) {
    return this.balanceService.getAllBalancesByUser(userId);
  }

  @Get()
  async getAllBalances(@Query('groupId') groupId?: number) {
    if (groupId) {
      return this.balanceService.getBalancesByGroup(groupId);
    }
    return this.balanceService.getAllBalances();
  }
}