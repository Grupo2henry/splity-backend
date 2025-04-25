/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
// import { SharedModule } from '../shared.module.jwt/jwt.service';
import { UserModule } from '../user/user.module';
import jwtConfig from 'src/config/jwt.config'; // trae las configuraciones de esta carpeta
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    // SharedModule,
    UserModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService],
})
export class AuthModule {}
