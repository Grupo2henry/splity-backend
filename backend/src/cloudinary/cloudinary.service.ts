import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { ExpensesService } from '../expenses/expenses.service'; 

@Injectable()
export class CloudinaryService {
  constructor(private readonly expensesService: ExpensesService) {}

  async uploadImage(file: Express.Multer.File, expenseId: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            try {
              await this.expensesService.updateExpense(expenseId, { imgUrl: result.secure_url });
              resolve(result);
            } catch (updateError) {
              reject(updateError);
            }
          } else {
            reject(new Error('Upload is undefined'));
          }
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}