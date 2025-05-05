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
import { SeedModule } from './seed/seed.module';
import { UserModule } from './user/user.module'; // Módulo de Usuario primero si Subscription depende de él
import { PaymentModule } from './payment/payment.module'; // Módulo de Pago antes de Subscription
import { SubscriptionModule } from './subscription/subscription.module';
import { GroupModule } from './group/group.module';
<<<<<<< HEAD
// import { GroupMembershipModule } from './group-membership/group-membership.module';
import { PaymentsModule } from './payments/payments.module';
=======
import { ExpensesModule } from './expenses/expenses.module';
import { BalanceModule } from './balance/balance.module';

>>>>>>> origin/develop
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    UserModule,
    PaymentModule, // Asegúrate de que PaymentModule esté antes de SubscriptionModule
    SubscriptionModule,
    GroupModule,
    ExpensesModule,
    SeedModule, // Puedes dejar SeedModule al final
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
<<<<<<< HEAD
    SeedModule,
    GroupModule,
    SubscriptionModule,
    ExpensesModule,
    PaymentsModule,
=======
    BalanceModule,
>>>>>>> origin/develop
  ],
  providers: [
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule {}