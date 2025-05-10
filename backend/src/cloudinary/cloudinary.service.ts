/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { ExpensesService } from '../expenses/expenses.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly userService: UserService
  ) {}

  /**
   * Uploads an image to Cloudinary and associates it with an expense
   * @param file - The image file to upload
   * @param expenseId - The UUID of the expense to associate the image with
   * @returns Promise<UploadApiResponse> - The Cloudinary upload response containing the image URL and metadata
   * @throws Error if the upload fails or if the expense update fails
   */
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

  /**
   * Uploads a profile image to Cloudinary and updates the user's profile picture URL
   * @param file - The profile image file to upload
   * @param userId - The UUID of the user to update
   * @returns Promise<UploadApiResponse> - The Cloudinary upload response containing the image URL and metadata
   * @throws Error if the upload fails or if the user update fails
   */
  async uploadProfileImage(file: Express.Multer.File, userId: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            try {
              await this.userService.update(userId, { profile_picture_url: result.secure_url });
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