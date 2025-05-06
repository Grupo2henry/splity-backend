/* eslint-disable prettier/prettier */
import { 
  Controller, 
  Post, 
  Body,
} from '@nestjs/common';
import { GoogleTokenDto } from '../dtos/google-authentication.dto';
import { GoogleAuthenticationService } from '../service/google-authentication.service';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}
  @Post()
  public async authenticate(
    @Body() googleTokenDto: GoogleTokenDto,
  ) {
    const token = await this.googleAuthenticationService.authentication(googleTokenDto);
    console.log(typeof token, token);
    return { access_token: token };
  }
}
