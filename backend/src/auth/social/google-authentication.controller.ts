import { Controller, Post, Body } from '@nestjs/common';
import { GoogleTokenDto } from './providers/dtos/google-authentication.dto';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}
  @Post()
  public authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authentication(googleTokenDto);
  }
}
