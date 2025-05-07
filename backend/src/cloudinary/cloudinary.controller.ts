import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  ParseUUIDPipe,
  Body,
  Put,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/authentication/authentication.guard';

@ApiTags('Images')
@Controller()
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('expenses/:id/image')
  @UseInterceptors(FileInterceptor('image'))
  async getUserImages(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (!file) {
      return {        
        statusCode: 400,
        message: 'No image file uploaded',
      };
    }
    return this.cloudinaryService.uploadImage(file, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('users/:id/profile-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (!file) {
      return {
        statusCode: 400,
        message: 'No image file uploaded',
      };
    }
    return this.cloudinaryService.uploadProfileImage(file, id);
  }
}
