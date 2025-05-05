import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryConfig } from './cloudinary';
/* import { ProductsModule } from '../products/products.module'; */

@Module({
    imports: [/* ProductsModule */],
    providers: [CloudinaryService, CloudinaryConfig],
    controllers: [CloudinaryController],
    exports: [CloudinaryService],
})
export class CloudinaryModule {}