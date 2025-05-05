/* eslint-disable prettier/prettier */
// src/seed/data/groups.seed.ts

import { usersSeed } from './users.seed';

export const groupsSeed = [
  // Usuarios con 3 grupos (Gonzalo, Nicolas Allende)
  {
    name: 'Viaje a Bariloche 2025',
    created_by: usersSeed[0], // Gonzalo
    created_at: new Date(),
  },
  {
    name: 'Asado Familiar',
    created_by: usersSeed[0], // Gonzalo
    created_at: new Date(),
  },
  {
    name: 'Club de Lectura',
    created_by: usersSeed[0], // Gonzalo
    created_at: new Date(),
  },
  {
    name: 'Cuentas del Departamento 1',
    created_by: usersSeed[1], // Nicolas Allende
    created_at: new Date(),
  },
  {
    name: 'Proyecto Software',
    created_by: usersSeed[1], // Nicolas Allende
    created_at: new Date(),
  },
  {
    name: 'Partidas de Ajedrez Online',
    created_by: usersSeed[1], // Nicolas Allende
    created_at: new Date(),
  },

  // Usuarios con 1 grupo (Laura, Martín)
  {
    name: 'Equipo de Volley',
    created_by: usersSeed[2], // Laura
    created_at: new Date(),
  },
  {
    name: 'Amigos del Barrio',
    created_by: usersSeed[3], // Martín
    created_at: new Date(),
  },

  // Usuarios con 2 grupos (Sofía, Javier, Cesar Garcia, Nicolas Alvarez)
  {
    name: 'Clases de Inglés',
    created_by: usersSeed[4], // Sofía
    created_at: new Date(),
  },
  {
    name: 'Organización Cumpleaños',
    created_by: usersSeed[4], // Sofía
    created_at: new Date(),
  },
  {
    name: 'Desarrollo App Móvil',
    created_by: usersSeed[5], // Javier
    created_at: new Date(),
  },
  {
    name: 'Grupo de Running',
    created_by: usersSeed[5], // Javier
    created_at: new Date(),
  },
  {
    name: 'Taller de Cocina',
    created_by: usersSeed[6], // Cesar Garcia
    created_at: new Date(),
  },
  {
    name: 'Intercambio de Libros',
    created_by: usersSeed[6], // Cesar Garcia
    created_at: new Date(),
  },
  {
    name: 'Plan de Ahorro',
    created_by: usersSeed[7], // Nicolas Alvarez
    created_at: new Date(),
  },
  {
    name: 'Voluntariado Local',
    created_by: usersSeed[7], // Nicolas Alvarez
    created_at: new Date(),
  },
];