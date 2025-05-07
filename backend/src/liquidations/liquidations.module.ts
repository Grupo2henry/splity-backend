/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LiquidationsController } from './liquidations.controller';
import { LiquidationsService } from './liquidations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Liquidation } from './entities/liquidation.entity';

@Module({
  controllers: [LiquidationsController],
  providers: [LiquidationsService],
  imports: [TypeOrmModule.forFeature([User, Liquidation])],
})
export class LiquidationsModule {}
