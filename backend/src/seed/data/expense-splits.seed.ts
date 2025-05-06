/* eslint-disable prettier/prettier */
// src/seed/data/expense-splits.seed.ts

import { usersSeed } from './users.seed';
import { expensesSeed } from './expenses.seed';
export const expenseSplitsSeed = [
  // Grupo 1: Viaje a Bariloche (Gasto 0: Alojamiento - 8 miembros)
  { expense: expensesSeed[0], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[0].amount / 8).toFixed(2)) },
  { expense: expensesSeed[0], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[0].amount / 8).toFixed(2)) },
  { expense: expensesSeed[0], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[0].amount / 8).toFixed(2)) },
  { expense: expensesSeed[0], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[0].amount / 8).toFixed(2)) },
  { expense: expensesSeed[0], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[0].amount / 8).toFixed(2)) },
  { expense: expensesSeed[0], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[0].amount / 8).toFixed(2)) },
  { expense: expensesSeed[0], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[0].amount / 8).toFixed(2)) },
  // Grupo 1: Viaje a Bariloche (Gasto 1: Comida - 8 miembros)
  { expense: expensesSeed[1], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[1].amount / 8).toFixed(2)) },
  { expense: expensesSeed[1], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[1].amount / 8).toFixed(2)) },
  { expense: expensesSeed[1], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[1].amount / 8).toFixed(2)) },
  { expense: expensesSeed[1], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[1].amount / 8).toFixed(2)) },
  { expense: expensesSeed[1], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[1].amount / 8).toFixed(2)) },
  { expense: expensesSeed[1], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[1].amount / 8).toFixed(2)) },
  { expense: expensesSeed[1], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[1].amount / 8).toFixed(2)) },
  // Grupo 1: Viaje a Bariloche (Gasto 4: Alquiler de equipos - 8 miembros)
  { expense: expensesSeed[3], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[3].amount / 8).toFixed(2)) },
  { expense: expensesSeed[3], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[3].amount / 8).toFixed(2)) },
  { expense: expensesSeed[3], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[3].amount / 8).toFixed(2)) },
  { expense: expensesSeed[3], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[3].amount / 8).toFixed(2)) },
  { expense: expensesSeed[3], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[3].amount / 8).toFixed(2)) },
  { expense: expensesSeed[3], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[3].amount / 8).toFixed(2)) },
  { expense: expensesSeed[3], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[3].amount / 8).toFixed(2)) },
  // Grupo 1: Viaje a Bariloche (Gasto 5: Souvenirs - 8 miembros)
  { expense: expensesSeed[4], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[4].amount / 8).toFixed(2)) },
  { expense: expensesSeed[4], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[4].amount / 8).toFixed(2)) },
  { expense: expensesSeed[4], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[4].amount / 8).toFixed(2)) },
  { expense: expensesSeed[4], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[4].amount / 8).toFixed(2)) },
  { expense: expensesSeed[4], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[4].amount / 8).toFixed(2)) },
  { expense: expensesSeed[4], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[4].amount / 8).toFixed(2)) },
  { expense: expensesSeed[4], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[4].amount / 8).toFixed(2)) },

  // Grupo 2: Asado Familiar (Gasto 6: Carne - 8 miembros)
  { expense: expensesSeed[5], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[5].amount / 8).toFixed(2)) },
  { expense: expensesSeed[5], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[5].amount / 8).toFixed(2)) },
  { expense: expensesSeed[5], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[5].amount / 8).toFixed(2)) },
  { expense: expensesSeed[5], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[5].amount / 8).toFixed(2)) },
  { expense: expensesSeed[5], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[5].amount / 8).toFixed(2)) },
  { expense: expensesSeed[5], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[5].amount / 8).toFixed(2)) },
  { expense: expensesSeed[5], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[5].amount / 8).toFixed(2)) },
  // Grupo 2: Asado Familiar (Gasto 7: Bebidas - 8 miembros)
  { expense: expensesSeed[6], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[6].amount / 8).toFixed(2)) },
  { expense: expensesSeed[6], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[6].amount / 8).toFixed(2)) },
  { expense: expensesSeed[6], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[6].amount / 8).toFixed(2)) },
  { expense: expensesSeed[6], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[6].amount / 8).toFixed(2)) },
  { expense: expensesSeed[6], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[6].amount / 8).toFixed(2)) },
  { expense: expensesSeed[6], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[6].amount / 8).toFixed(2)) },
  { expense: expensesSeed[6], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[6].amount / 8).toFixed(2)) },
  // Grupo 2: Asado Familiar (Gasto 8: Carbón - 8 miembros)
  { expense: expensesSeed[7], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[7].amount / 8).toFixed(2)) },
  { expense: expensesSeed[7], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[7].amount / 8).toFixed(2)) },
  { expense: expensesSeed[7], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[7].amount / 8).toFixed(2)) },
  { expense: expensesSeed[7], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[7].amount / 8).toFixed(2)) },
  { expense: expensesSeed[7], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[7].amount / 8).toFixed(2)) },
  { expense: expensesSeed[7], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[7].amount / 8).toFixed(2)) },
  { expense: expensesSeed[7], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[7].amount / 8).toFixed(2)) },

  // Grupo 3: Club de Lectura (Gasto 9: Compra de libro - 8 miembros)
  { expense: expensesSeed[8], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[8].amount / 8).toFixed(2)) },
  { expense: expensesSeed[8], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[8].amount / 8).toFixed(2)) },
  { expense: expensesSeed[8], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[8].amount / 8).toFixed(2)) },
  { expense: expensesSeed[8], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[8].amount / 8).toFixed(2)) },
  { expense: expensesSeed[8], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[8].amount / 8).toFixed(2)) },
  { expense: expensesSeed[8], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[8].amount / 8).toFixed(2)) },
  { expense: expensesSeed[8], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[8].amount / 8).toFixed(2)) },
  // Grupo 3: Club de Lectura (Gasto 10: Café - 8 miembros)
  { expense: expensesSeed[9], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[9].amount / 8).toFixed(2)) },
  { expense: expensesSeed[9], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[9].amount / 8).toFixed(2)) },
  { expense: expensesSeed[9], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[9].amount / 8).toFixed(2)) },
  { expense: expensesSeed[9], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[9].amount / 8).toFixed(2)) },
  { expense: expensesSeed[9], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[9].amount / 8).toFixed(2)) },
  { expense: expensesSeed[9], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[9].amount / 8).toFixed(2)) },
  { expense: expensesSeed[9], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[9].amount / 8).toFixed(2)) },
  // Grupo 3: Club de Lectura (Gasto 11: Snacks - 8 miembros)
  { expense: expensesSeed[10], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[10].amount / 8).toFixed(2)) },
  { expense: expensesSeed[10], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[10].amount / 8).toFixed(2)) },
  { expense: expensesSeed[10], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[10].amount / 8).toFixed(2)) },
  { expense: expensesSeed[10], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[10].amount / 8).toFixed(2)) },
  { expense: expensesSeed[10], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[10].amount / 8).toFixed(2)) },
  { expense: expensesSeed[10], user: usersSeed[6], amount_owed: parseFloat((expensesSeed[10].amount / 8).toFixed(2)) },
  { expense: expensesSeed[10], user: usersSeed[7], amount_owed: parseFloat((expensesSeed[10].amount / 8).toFixed(2)) },

  // Grupo 4: Cuentas del Departamento 1 (Gasto 12: Alquiler - 6 miembros)
  { expense: expensesSeed[11], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[11].amount / 6).toFixed(2)) },
  { expense: expensesSeed[11], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[11].amount / 6).toFixed(2)) },
  { expense: expensesSeed[11], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[11].amount / 6).toFixed(2)) },
  { expense: expensesSeed[11], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[11].amount / 6).toFixed(2)) },
  { expense: expensesSeed[11], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[11].amount / 6).toFixed(2)) },
  // Grupo 4: Cuentas del Departamento 1 (Gasto 13: Servicios - 6 miembros)
  { expense: expensesSeed[12], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[12].amount / 6).toFixed(2)) },
  { expense: expensesSeed[12], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[12].amount / 6).toFixed(2)) },
  { expense: expensesSeed[12], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[12].amount / 6).toFixed(2)) },
  { expense: expensesSeed[12], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[12].amount / 6).toFixed(2)) },
  { expense: expensesSeed[12], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[12].amount / 6).toFixed(2)) },
  // Grupo 4: Cuentas del Departamento 1 (Gasto 14: Internet - 6 miembros)
  { expense: expensesSeed[13], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[13].amount / 6).toFixed(2)) },
  { expense: expensesSeed[13], user: usersSeed[2], amount_owed: parseFloat((expensesSeed[13].amount / 6).toFixed(2)) },
  { expense: expensesSeed[13], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[13].amount / 6).toFixed(2)) },
  { expense: expensesSeed[13], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[13].amount / 6).toFixed(2)) },
  { expense: expensesSeed[13], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[13].amount / 6).toFixed(2)) },

  // Grupo 5: Proyecto Software (Gasto 15: Suscripción - 6 miembros)
  { expense: expensesSeed[14], user: usersSeed[0], amount_owed: parseFloat((expensesSeed[14].amount / 6).toFixed(2)) },
  { expense: expensesSeed[14], user: usersSeed[1], amount_owed: parseFloat((expensesSeed[14].amount / 6).toFixed(2)) },
  { expense: expensesSeed[14], user: usersSeed[3], amount_owed: parseFloat((expensesSeed[14].amount / 6).toFixed(2)) },
  { expense: expensesSeed[14], user: usersSeed[4], amount_owed: parseFloat((expensesSeed[14].amount / 6).toFixed(2)) },
  { expense: expensesSeed[14], user: usersSeed[5], amount_owed: parseFloat((expensesSeed[14].amount / 6).toFixed(2)) }
]