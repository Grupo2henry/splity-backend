/* eslint-disable prettier/prettier */
// src/seed/data/payments.seed.ts

import { usersSeed } from './users.seed';

export const paymentsSeed = [
  { user: usersSeed[1], amount: 10000, status: 'accepted', payment_date: new Date() }, // Nico pagó
  { user: usersSeed[0], amount: 10000, status: 'accepted', payment_date: new Date() }, // Gonzalo pagó
  { user: usersSeed[2], amount: 10000, status: 'pending', payment_date: new Date() }, // Laura tiene un pago pendiente
  { user: usersSeed[3], amount: 10000, status: 'accepted', payment_date: new Date() }, // Martín pagó
];