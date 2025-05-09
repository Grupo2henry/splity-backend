/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Description of the expense',
    example: 'Lunch at Restaurant',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Amount of the expense',
    example: 45.50,
    minimum: 0,
    type: Number
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'UUID of the user who paid for the expense',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  paid_by: string;


  @ApiProperty({
    description: 'URL of the expense image (optional)',
    example: 'https://res.cloudinary.com/example/image/upload/v1234567890/expense_image.jpg',
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: 'Date of the expense in ISO 8601 format',
    example: '2024-03-20',
    format: 'date-time'
  })
  @IsDateString()
  date: string;
}
