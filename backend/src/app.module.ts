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
import { AccesTokenGuard } from './auth/guards/acces-token.guards.ts/acces-token.guards.ts.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { SeedModule } from './seed/seed.module';

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
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AccesTokenGuard,
  ],
  controllers: [AppController],
})
export class AppModule {}
