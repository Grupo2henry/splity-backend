/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import jwtConfig from '../config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuthenticationController } from './controllers/google-authentication.controller';
import { GoogleAuthenticationService } from './service/google-authentication.service';
import { GenerateTokensProvider } from './service/generate-token.service';
import { MailsModule } from 'src/mails/mails.module';
import { AccessTokenGuard } from './guards/access-token.guard/access-token.guard';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MailsModule,
  ],
  providers: [
    AuthService,
    GoogleAuthenticationService,
    GenerateTokensProvider,
    AuthenticationGuard,
    AccessTokenGuard,
  ],
  controllers: [AuthController, GoogleAuthenticationController],
  exports: [AuthService, JwtModule,AccessTokenGuard],
})
export class AuthModule {}
