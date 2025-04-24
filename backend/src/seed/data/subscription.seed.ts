/* eslint-disable prettier/prettier */
// src/seed/data/subscriptions.seed.ts

import { usersSeed } from './users.seed';

export const subscriptionsSeed = [
  { user: usersSeed[0], status: 'active', tier: 'premium', started_at: new Date('2025-04-20'), ends_at: new Date('2025-05-20') },
  { user: usersSeed[1], status: 'trialing', tier: 'basic', started_at: new Date('2025-04-22'), ends_at: new Date('2025-04-29') },
  { user: usersSeed[2], status: 'active', tier: 'standard', started_at: new Date('2025-04-15'), ends_at: new Date('2025-05-15') },
  { user: usersSeed[3], status: 'cancelled', tier: 'basic', started_at: new Date('2025-03-01'), ends_at: new Date('2025-03-31') },
];