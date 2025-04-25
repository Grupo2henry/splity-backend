/* eslint-disable prettier/prettier */
// src/seed/data/groups.seed.ts

import { usersSeed } from './users.seed';

export const groupsSeed = [
  {
    name: 'Viaje a Bariloche',
    created_by: usersSeed[0], // Gonzalo creó el grupo
    created_at: new Date(),
  },
  {
    name: 'Cuentas del Departamento',
    created_by: usersSeed[1], // Nico creó el grupo
    created_at: new Date(),
  },
  {
    name: 'Proyecto de la Facu',
    created_by: usersSeed[2], // Laura creó el grupo
    created_at: new Date(),
  },
  {
    name: 'Salida de Fin de Semana',
    created_by: usersSeed[3], // Martín creó el grupo
    created_at: new Date(),
  },
];