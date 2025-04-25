/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
<<<<<<< HEAD
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccesTokenGuard } from './auth/guards/acces-token.guards.ts/acces-token.guards.ts.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { SeedModule } from './seed/seed.module';
=======
import { SubscriptionModule } from './subscription/subscription.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SeedModule } from './seed/seed.module';
// import jwtConfig from './config/jwt.config';
// import { JwtModule } from '@nestjs/jwt';
// import { APP_GUARD } from '@nestjs/core';
// import { AccesTokenGuardsTsGuard } from './modules/auth/guards/acces-token.guards.ts/acces-token.guards.ts.guard';
import { GroupModule } from './group/group.module';
import { GroupMembershipModule } from './group-membership/group-membership.module';
>>>>>>> origin/develop

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
<<<<<<< HEAD
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    SeedModule,
=======
    SubscriptionModule,
    ExpensesModule,
    /* SeedModule ,*/
    // ConfigModule.forFeature(jwtConfig),
    // JwtModule.registerAsync(jwtConfig.asProvider()),
>>>>>>> origin/develop
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AccesTokenGuard,
  ],
  controllers: [AppController],
})
export class AppModule {}
