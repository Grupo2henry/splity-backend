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
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiConsumes, 
  ApiBody, 
  ApiResponse,
  ApiParam,
  ApiHeader,
  ApiExtraModels
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/authentication/authentication.guard';

@ApiTags('Images')
@Controller()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication',
  required: true,
})
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('expenses/:id/image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ 
    summary: 'Upload an image for an expense',
    description: 'Uploads an image to Cloudinary and associates it with a specific expense. The image will be stored in Cloudinary and the URL will be saved in the expense record.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The UUID of the expense',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image file to upload (supported formats: jpg, jpeg, png, gif)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        secure_url: { 
          type: 'string',
          description: 'The secure URL of the uploaded image',
          example: 'https://res.cloudinary.com/example/image/upload/v1234567890/expense_image.jpg'
        },
        public_id: { 
          type: 'string',
          description: 'The public ID of the uploaded image',
          example: 'expense_image'
        },
        format: { 
          type: 'string',
          description: 'The format of the uploaded image',
          example: 'jpg'
        },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'No image file uploaded',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'No image file uploaded' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing authentication token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Expense not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Expense not found' }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Upload a profile image for a user',
    description: 'Uploads a profile image to Cloudinary and updates the user\'s profile picture URL. The image will be stored in Cloudinary and the URL will be saved in the user\'s profile.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The profile image file to upload (supported formats: jpg, jpeg, png, gif)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        secure_url: { 
          type: 'string',
          description: 'The secure URL of the uploaded profile image',
          example: 'https://res.cloudinary.com/example/image/upload/v1234567890/profile_image.jpg'
        },
        public_id: { 
          type: 'string',
          description: 'The public ID of the uploaded image',
          example: 'profile_image'
        },
        format: { 
          type: 'string',
          description: 'The format of the uploaded image',
          example: 'jpg'
        },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'No image file uploaded',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'No image file uploaded' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing authentication token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' }
      }
    }
  })
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
