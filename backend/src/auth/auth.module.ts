/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import jwtConfig from '../config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
<<<<<<< HEAD
import { MailsModule } from 'src/mails/mails.module';
=======
import { AccessTokenGuard } from './guards/access-token.guard/access-token.guard';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
>>>>>>> origin/develop

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
  exports: [AuthService, JwtModule],
})
export class AuthModule {}