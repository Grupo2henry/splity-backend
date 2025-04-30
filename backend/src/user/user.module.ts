/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsuariosController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindOneByGoogleIdTs } from './providers/find-one-by-google-id.ts';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsuariosController],
  providers: [UserService, FindOneByGoogleIdTs],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
