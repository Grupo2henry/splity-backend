/* eslint-disable prettier/prettier */
// src/seed/data/expenses.seed.ts

import { usersSeed } from './users.seed';
import { groupsSeed } from './groups.seed';
import { ExpenseSeed } from '../interfaces/expenses.interface';

export const expensesSeed: ExpenseSeed[]= [
  // Grupo 1: Viaje a Bariloche (ID: 0) - 5 gastos
  {
    group: groupsSeed[0],
    description: 'Alojamiento',
    amount: 350.50,
    paid_by: usersSeed[0], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[0],
    description: 'Comida en el centro',
    amount: 120.75,
    paid_by: usersSeed[1], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[0],
    description: 'Clases de ski',
    amount: 180.00,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[0],
    description: 'Alquiler de equipos',
    amount: 95.20,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[0],
    description: 'Souvenirs',
    amount: 45.80,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 2: Asado Familiar (ID: 1) - 4 gastos
  {
    group: groupsSeed[1],
    description: 'Carne',
    amount: 75.00,
    paid_by: usersSeed[1], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[1],
    description: 'Bebidas',
    amount: 40.25,
    paid_by: usersSeed[0], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[1],
    description: 'Carbón',
    amount: 15.50,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[1],
    description: 'Ensalada',
    amount: 22.10,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 3: Club de Lectura (ID: 2) - 3 gastos
  {
    group: groupsSeed[2],
    description: 'Compra de libro mensual',
    amount: 30.00,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[2],
    description: 'Café en la librería',
    amount: 12.50,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[2],
    description: 'Snacks para la reunión',
    amount: 8.75,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 4: Cuentas del Departamento 1 (ID: 3) - 4 gastos
  {
    group: groupsSeed[3],
    description: 'Alquiler',
    amount: 850.00,
    paid_by: usersSeed[1], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[3],
    description: 'Servicios (Luz, Agua, Gas)',
    amount: 90.40,
    paid_by: usersSeed[0], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[3],
    description: 'Internet',
    amount: 60.75,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[3],
    description: 'Productos de limpieza',
    amount: 35.90,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 5: Proyecto Software (ID: 4) - 3 gastos
  {
    group: groupsSeed[4],
    description: 'Suscripción a herramienta online',
    amount: 49.99,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[4],
    description: 'Dominio del proyecto',
    amount: 12.00,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[4],
    description: 'Hosting del prototipo',
    amount: 18.50,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 6: Partidas de Ajedrez Online (ID: 5) - 3 gastos
  {
    group: groupsSeed[5],
    description: 'Suscripción premium plataforma',
    amount: 10.00,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[5],
    description: 'Compra de libro de aperturas',
    amount: 25.50,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[5],
    description: 'Torneo online (inscripción)',
    amount: 5.00,
    paid_by: usersSeed[5], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 7: Equipo de Volley (ID: 6) - 3 gastos
  {
    group: groupsSeed[6],
    description: 'Alquiler de cancha',
    amount: 30.00,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[6],
    description: 'Compra de pelota nueva',
    amount: 18.75,
    paid_by: usersSeed[0], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[6],
    description: 'Inscripción a torneo amateur',
    amount: 45.00,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 8: Amigos del Barrio (ID: 7) - 3 gastos
  {
    group: groupsSeed[7],
    description: 'Pizza para la noche',
    amount: 38.90,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[7],
    description: 'Cervezas',
    amount: 25.60,
    paid_by: usersSeed[1], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[7],
    description: 'Snacks varios',
    amount: 12.30,
    paid_by: usersSeed[5], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 9: Clases de Inglés (ID: 8) - 3 gastos
  {
    group: groupsSeed[8],
    description: 'Cuota mensual',
    amount: 65.00,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[8],
    description: 'Material de estudio',
    amount: 15.20,
    paid_by: usersSeed[0], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[8],
    description: 'Libro de ejercicios',
    amount: 20.80,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 10: Organización Cumpleaños (ID: 9) - 3 gastos
  {
    group: groupsSeed[9],
    description: 'Decoración',
    amount: 42.50,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[9],
    description: 'Torta',
    amount: 30.00,
    paid_by: usersSeed[1], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[9],
    description: 'Bebidas',
    amount: 28.75,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 11: Desarrollo App Móvil (ID: 10) - 3 gastos
  {
    group: groupsSeed[10],
    description: 'Librería de UI',
    amount: 35.00,
    paid_by: usersSeed[5], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[10],
    description: 'Servicios de testing',
    amount: 22.90,
    paid_by: usersSeed[0], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[10],
    description: 'Plantillas de diseño',
    amount: 15.40,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 12: Grupo de Running (ID: 11) - 3 gastos
  {
    group: groupsSeed[11],
    description: 'Inscripción a carrera',
    amount: 28.00,
    paid_by: usersSeed[5], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[11],
    description: 'Botella de agua grupal',
    amount: 12.60,
    paid_by: usersSeed[1], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[11],
    description: 'Snacks post-carrera',
    amount: 9.15,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 13: Taller de Cocina (ID: 12) - 3 gastos
  {
    group: groupsSeed[12],
    description: 'Ingredientes para la clase',
    amount: 48.50,
    paid_by: usersSeed[6], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[12],
    description: 'Utensilios compartidos',
    amount: 21.20,
    paid_by: usersSeed[0], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[12],
    description: 'Bebidas para la clase',
    amount: 10.90,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 14: Intercambio de Libros (ID: 13) - 3 gastos
  {
    group: groupsSeed[13],
    description: 'Envío de libros',
    amount: 15.00,
    paid_by: usersSeed[6], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[13],
    description: 'Café en el encuentro',
    amount: 11.75,
    paid_by: usersSeed[2], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[13],
    description: 'Donación para la biblioteca',
    amount: 20.00,
    paid_by: usersSeed[5], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 15: Plan de Ahorro (ID: 14) - 3 gastos
  {
    group: groupsSeed[14],
    description: 'Aporte mensual',
    amount: 100.00,
    paid_by: usersSeed[7], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[14],
    description: 'Intereses generados (reparto)',
    amount: 5.50,
    paid_by: usersSeed[1], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[14],
    description: 'Comisión bancaria',
    amount: 2.10,
    paid_by: usersSeed[4], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },

  // Grupo 16: Voluntariado Local (ID: 15) - 3 gastos
  {
    group: groupsSeed[15],
    description: 'Compra de materiales',
    amount: 32.80,
    paid_by: usersSeed[7], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[15],
    description: 'Transporte para actividades',
    amount: 18.30,
    paid_by: usersSeed[3], // Use the id of the user
    date: new Date().toISOString(), // Format date as ISO string
  },
  {
    group: groupsSeed[15],
    description: 'Refrigerios para voluntarios',
    amount: 14.50,
    paid_by: usersSeed[5],
    date: new Date().toISOString(), },
];