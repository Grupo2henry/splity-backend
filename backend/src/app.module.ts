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
import { SubscriptionModule } from './subscription/subscription.module';
import { ExpensesModule } from './expenses/expenses.module';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule, // <--- Asegúrate de que AuthModule esté aquí primero
    UserModule, // Si lo volviste a agregar, déjalo después de AuthModule
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    SeedModule,
    GroupModule,
    SubscriptionModule,
    ExpensesModule,
    SeedModule
  ],
  providers: [
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule {}