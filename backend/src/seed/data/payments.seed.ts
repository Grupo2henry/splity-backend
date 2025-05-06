/* eslint-disable prettier/prettier */
// src/seed/data/payments.seed.ts

import { usersSeed } from './users.seed';

export const paymentsSeed = [
  {
    user: usersSeed[1],
    amount: 10000.00,
    status: 'accepted',
    transaction_id: 'MP-123456789-1',
    payment_date: new Date(),
    active: true,
  },
  {
    user: usersSeed[0],
    amount: 10000.00,
    status: 'accepted',
    transaction_id: 'MP-987654321-2',
    payment_date: new Date(),
    active: true,
  },
  {
    user: usersSeed[2],
    amount: 10000.00,
    status: 'pending',
    transaction_id: 'MP-555555555-3',
    payment_date: new Date(),
    active: true,
  },
  {
    user: usersSeed[3],
    amount: 10000.00,
    status: 'accepted',
    transaction_id: 'MP-111222333-4',
    payment_date: new Date(),
    active: true,
  },
];