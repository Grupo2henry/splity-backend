/* eslint-disable prettier/prettier */
export interface ExpenseSplitSeed {
  expense: { description: string }; // o { id: string } si lo tenés
  user: { email: string };
  amount_owed: number;
}