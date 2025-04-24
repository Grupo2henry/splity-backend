/* eslint-disable prettier/prettier */
// src/seed/data/payments.seed.ts

import { usersSeed } from './users.seed';

export const paymentsSeed = [
  { user: usersSeed[1], amount: 100.00, method: 'Transferencia bancaria', status: 'completed', paid_at: new Date() }, // Nico pagó a Gonzalo
  { user: usersSeed[0], amount: 50.00, method: 'Efectivo', status: 'completed', paid_at: new Date() }, // Gonzalo pagó algo
  { user: usersSeed[2], amount: 20.00, method: 'Tarjeta de crédito', status: 'pending', paid_at: new Date() }, // Laura tiene un pago pendiente
  { user: usersSeed[3], amount: 30.50, method: 'Billetera virtual', status: 'completed', paid_at: new Date() }, // Martín realizó un pago
];