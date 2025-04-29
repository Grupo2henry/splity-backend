// dto/create-expense.dto.ts
export class CreateExpenseDto {
    description: string;
    amount: number;
    paid_by: number; // userId
  }