/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token.guard/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { SeedModule } from './seed/seed.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ExpensesModule } from './expenses/expenses.module';
import { GroupModule } from './group/group.module';
// import { GroupMembershipModule } from './group-membership/group-membership.module';
// import { RedisModule } from './config/redis.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    SeedModule,
    GroupModule,
    SubscriptionModule,
    ExpensesModule,
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AccessTokenGuard,
  ],
  controllers: [AppController],
})
export class AppModule {}
