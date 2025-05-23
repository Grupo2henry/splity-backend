/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { ExpensesService } from '../expenses/expenses.service';
import { UserService } from '../user/user.service';
const toStream = require('buffer-to-stream');

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
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const upload = v2.uploader.upload_stream(
      { resource_type: 'auto' },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(new Error(error.message));
        }

        if (!result) {
          return reject(new Error('Upload result is undefined'));
        }

        this.expensesService.updateExpense(expenseId, { imgUrl: result.secure_url })
          .then(() => resolve(result))
          .catch((updateError: unknown) => {
            reject(updateError instanceof Error ? updateError : new Error('Failed to update expense with image URL'));
          });
      }
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
      (error, result) => {
        if (error) {
          reject(new Error(typeof error === 'string' ? error : JSON.stringify(error)));
        } else if (result) {
          void this.userService
            .update(userId, { profile_picture_url: result.secure_url })
            .then(() => resolve(result))
            .catch((updateError) => reject(new Error(String(updateError))));
          } else {
            reject(new Error('Upload is undefined'));
          }
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}