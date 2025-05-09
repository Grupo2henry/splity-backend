/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsuariosController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { UserRepository } from './user.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
      JwtModule,
      ConfigModule.forFeature(jwtConfig)
  ],
  controllers: [UsuariosController],
  providers: [UserService, UserRepository],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}