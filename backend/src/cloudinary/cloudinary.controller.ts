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
import { ProductsService } from '../products/products.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard.middleware';

@ApiTags('Images')
@Controller()
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productsService: ProductsService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('files/uploadImage/:id')
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

}
