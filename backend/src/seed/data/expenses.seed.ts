/* eslint-disable prettier/prettier */
// src/seed/data/expenses.seed.ts

import { usersSeed } from './users.seed';
import { groupsSeed } from './groups.seed';

export const expensesSeed = [
  {
    group: groupsSeed[0], // Viaje a Bariloche
    description: 'Alojamiento',
    amount: 350.50,
    paid_by: usersSeed[0], // Gonzalo pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[0], // Viaje a Bariloche
    description: 'Comida en el centro',
    amount: 120.75,
    paid_by: usersSeed[1], // Nico pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[1], // Cuentas del Departamento
    description: 'Alquiler',
    amount: 800.00,
    paid_by: usersSeed[1], // Nico pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[1], // Cuentas del Departamento
    description: 'Servicios (Luz, Agua, Gas)',
    amount: 75.20,
    paid_by: usersSeed[0], // Gonzalo pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[2], // Proyecto de la Facu
    description: 'Suscripción a herramienta online',
    amount: 25.99,
    paid_by: usersSeed[2], // Laura pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[3], // Salida de Fin de Semana
    description: 'Nafta',
    amount: 60.30,
    paid_by: usersSeed[3], // Martín pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[0], // Viaje a Bariloche
    description: 'Clases de ski',
    amount: 180.00,
    paid_by: usersSeed[2], // Laura pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[1], // Cuentas del Departamento
    description: 'Internet',
    amount: 55.50,
    paid_by: usersSeed[1], // Nico pagó
    created_at: new Date(),
  },
];