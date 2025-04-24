/* eslint-disable prettier/prettier */
// src/seed/data/expenses.seed.ts

import { usersSeed } from './users.seed';
import { groupsSeed } from './groups.seed';

export const expensesSeed = [
  {
    group: groupsSeed[0], // Viaje a Bariloche
    descripcion: 'Alojamiento',
    monto: 350.50,
    pagado_por: usersSeed[0], // Gonzalo pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[0], // Viaje a Bariloche
    descripcion: 'Comida en el centro',
    monto: 120.75,
    pagado_por: usersSeed[1], // Nico pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[1], // Cuentas del Departamento
    descripcion: 'Alquiler',
    monto: 800.00,
    pagado_por: usersSeed[1], // Nico pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[1], // Cuentas del Departamento
    descripcion: 'Servicios (Luz, Agua, Gas)',
    monto: 75.20,
    pagado_por: usersSeed[0], // Gonzalo pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[2], // Proyecto de la Facu
    descripcion: 'Suscripción a herramienta online',
    monto: 25.99,
    pagado_por: usersSeed[2], // Laura pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[3], // Salida de Fin de Semana
    descripcion: 'Nafta',
    monto: 60.30,
    pagado_por: usersSeed[3], // Martín pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[0], // Viaje a Bariloche
    descripcion: 'Clases de ski',
    monto: 180.00,
    pagado_por: usersSeed[2], // Laura pagó
    created_at: new Date(),
  },
  {
    group: groupsSeed[1], // Cuentas del Departamento
    descripcion: 'Internet',
    monto: 55.50,
    pagado_por: usersSeed[1], // Nico pagó
    created_at: new Date(),
  },
];