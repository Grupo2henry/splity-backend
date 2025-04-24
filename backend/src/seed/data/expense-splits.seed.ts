/* eslint-disable prettier/prettier */
// src/seed/data/expense-splits.seed.ts

import { usersSeed } from './users.seed';
import { expensesSeed } from './expenses.seed';

export const expenseSplitsSeed = [
  // Viaje a Bariloche
  { expense: expensesSeed[0], user: usersSeed[1], amount_owed: 175.25 }, // Nico debe a Gonzalo (Alojamiento)
  { expense: expensesSeed[0], user: usersSeed[2], amount_owed: 175.25 }, // Laura debe a Gonzalo (Alojamiento)
  { expense: expensesSeed[1], user: usersSeed[0], amount_owed: 40.25 },  // Gonzalo debe a Nico (Comida - 3 personas)
  { expense: expensesSeed[1], user: usersSeed[2], amount_owed: 40.25 },  // Laura debe a Nico (Comida - 3 personas)
  { expense: expensesSeed[6], user: usersSeed[0], amount_owed: 60.00 },  // Gonzalo debe a Laura (Clases de ski - 3 personas)
  { expense: expensesSeed[6], user: usersSeed[1], amount_owed: 60.00 },  // Nico debe a Laura (Clases de ski - 3 personas)

  // Cuentas del Departamento
  { expense: expensesSeed[2], user: usersSeed[0], amount_owed: 400.00 }, // Gonzalo debe a Nico (Alquiler)
  { expense: expensesSeed[3], user: usersSeed[1], amount_owed: 37.60 },  // Nico debe a Gonzalo (Servicios)
  { expense: expensesSeed[7], user: usersSeed[0], amount_owed: 27.75 },  // Gonzalo debe a Nico (Internet)

  // Proyecto de la Facu
  { expense: expensesSeed[4], user: usersSeed[3], amount_owed: 12.99 }, // Martín debe a Laura (Herramienta)

  // Salida de Fin de Semana
  { expense: expensesSeed[5], user: usersSeed[0], amount_owed: 20.10 },  // Gonzalo debe a Martín (Nafta - 3 personas)
  { expense: expensesSeed[5], user: usersSeed[2], amount_owed: 20.10 },  // Laura debe a Martín (Nafta - 3 personas)
];