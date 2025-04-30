/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
// import { SharedModule } from '../shared.module.jwt/jwt.service';
import { UserModule } from '../user/user.module';
import jwtConfig from '../config/jwt.config'; // trae las configuraciones de esta carpeta
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';

@Module({
  providers: [AuthService, GoogleAuthenticationService, GenerateTokensProvider],
  controllers: [AuthController, GoogleAuthenticationController],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
