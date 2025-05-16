/* eslint-disable prettier/prettier */
// src/seed/data/group-memberships.seed.ts

import { usersSeed } from './users.seed';
import { groupsSeed } from './groups.seed';
import { GroupRole } from '../../group/enums/group-role.enum';

export const groupMembershipsSeed = [
  // Grupo 1: Viaje a Bariloche (Todos los usuarios - 8 miembros)
  { user: usersSeed[1], group: groupsSeed[0], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[2], group: groupsSeed[0], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[3], group: groupsSeed[0], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[0], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[0], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[6], group: groupsSeed[0], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[7], group: groupsSeed[0], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 2: Asado Familiar (Todos los usuarios - 8 miembros)
  { user: usersSeed[1], group: groupsSeed[1], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[2], group: groupsSeed[1], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[3], group: groupsSeed[1], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[1], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[1], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[6], group: groupsSeed[1], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[7], group: groupsSeed[1], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 3: Club de Lectura (Todos los usuarios - 8 miembros),
  { user: usersSeed[1], group: groupsSeed[2], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[2], group: groupsSeed[2], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[3], group: groupsSeed[2], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[2], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[2], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[6], group: groupsSeed[2], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[7], group: groupsSeed[2], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 4: Cuentas del Departamento 1 (6 miembros)
  { user: usersSeed[0], group: groupsSeed[3], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[2], group: groupsSeed[3], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[3], group: groupsSeed[3], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[3], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[3], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 5: Proyecto Software (6 miembros)
  { user: usersSeed[2], group: groupsSeed[4], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[3], group: groupsSeed[4], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[4], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[4], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[6], group: groupsSeed[4], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 6: Partidas de Ajedrez Online (6 miembros)
  { user: usersSeed[3], group: groupsSeed[5], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[5], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[5], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[6], group: groupsSeed[5], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[7], group: groupsSeed[5], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 7: Equipo de Volley (4 miembros)
  { user: usersSeed[0], group: groupsSeed[6], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[6], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[6], group: groupsSeed[6], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 8: Amigos del Barrio (4 miembros)
  { user: usersSeed[1], group: groupsSeed[7], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[7], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[7], group: groupsSeed[7], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 9: Clases de Inglés (4 miembros)
  { user: usersSeed[0], group: groupsSeed[8], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[2], group: groupsSeed[8], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[6], group: groupsSeed[8], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 10: Organización Cumpleaños (3 miembros)
  { user: usersSeed[1], group: groupsSeed[9], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[3], group: groupsSeed[9], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 11: Desarrollo App Móvil (3 miembros)
  { user: usersSeed[0], group: groupsSeed[10], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[2], group: groupsSeed[10], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 12: Grupo de Running (3 miembros)
  { user: usersSeed[1], group: groupsSeed[11], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[11], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 13: Taller de Cocina (3 miembros)
  { user: usersSeed[0], group: groupsSeed[12], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[3], group: groupsSeed[12], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 14: Intercambio de Libros (3 miembros)
  { user: usersSeed[2], group: groupsSeed[13], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[13], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 15: Plan de Ahorro (3 miembros)
  { user: usersSeed[1], group: groupsSeed[14], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[4], group: groupsSeed[14], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },

  // Grupo 16: Voluntariado Local (3 miembros)
  { user: usersSeed[3], group: groupsSeed[15], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
  { user: usersSeed[5], group: groupsSeed[15], joined_at: new Date(), status: 'active', role: GroupRole.MEMBER },
];