/* eslint-disable prettier/prettier */
export interface ExpenseSeed {
  group: { name: string };
  description: string;
  amount: number;
  paid_by: { email: string };
  date?: string;
  imgUrl?: string; // <-- agregalo acá
}