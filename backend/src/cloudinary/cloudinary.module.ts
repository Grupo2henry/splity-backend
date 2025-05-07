import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryConfig } from './cloudinary';
import { UserModule } from '../user/user.module';
/* import { ProductsModule } from '../products/products.module'; */

/**
 * CloudinaryModule handles all image upload functionality using Cloudinary service.
 * It provides endpoints for uploading expense images and user profile pictures.
 * 
 * @module CloudinaryModule
 * @requires UserModule - For user profile picture updates
 */
@Module({
    imports: [UserModule],
    providers: [CloudinaryService, CloudinaryConfig],
    controllers: [CloudinaryController],
    exports: [CloudinaryService],
})
export class CloudinaryModule {}