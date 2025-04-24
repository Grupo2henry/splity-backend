import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/typeorm';
import { AuthModule } from './modules/auth/auth.module';
// import jwtConfig from './config/jwt.config';
// import { JwtModule } from '@nestjs/jwt';
// import { APP_GUARD } from '@nestjs/core';
// import { AccesTokenGuardsTsGuard } from './modules/auth/guards/acces-token.guards.ts/acces-token.guards.ts.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    // ConfigModule.forFeature(jwtConfig),
    // JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  // providers: [{ provide: APP_GUARD, useClass: AccesTokenGuardsTsGuard }],
})
export class AppModule {}
