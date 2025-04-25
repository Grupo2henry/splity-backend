/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { SeedModule } from './seed/seed.module';
// import jwtConfig from './config/jwt.config';
// import { JwtModule } from '@nestjs/jwt';
// import { APP_GUARD } from '@nestjs/core';
// import { AccesTokenGuardsTsGuard } from './modules/auth/guards/acces-token.guards.ts/acces-token.guards.ts.guard';
import { GroupModule } from './group/group.module';
import { GroupMembershipModule } from './group-membership/group-membership.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    SeedModule,
    GroupModule,
    GroupMembershipModule,
    // ConfigModule.forFeature(jwtConfig),
    // JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [AppService],
  // providers: [{ provide: APP_GUARD, useClass: AccesTokenGuardsTsGuard }],
  controllers: [AppController],
})
export class AppModule {}
