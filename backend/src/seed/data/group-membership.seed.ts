/* eslint-disable prettier/prettier */
// src/seed/data/group-memberships.seed.ts

import { usersSeed } from './users.seed';
import { groupsSeed } from './groups.seed';
import { GroupRole } from '../../group/enums/group-role.enum';

export const groupMembershipsSeed = [
  {
    user: usersSeed[0], // Gonzalo
    group: groupsSeed[0], // Viaje a Bariloche
    joined_at: new Date(),
    status: 'active',
    role: GroupRole.ADMIN,
  },
  {
    user: usersSeed[1], // Nico
    group: groupsSeed[0], // Viaje a Bariloche
    joined_at: new Date(),
    status: 'active',
    role: GroupRole.MEMBER,
  },
  {
    user: usersSeed[2], // Laura
    group: groupsSeed[0], // Viaje a Bariloche
    joined_at: new Date(),
    status: 'pending',
    role: GroupRole.MEMBER,
  },
  {
    user: usersSeed[1], // Nico
    group: groupsSeed[1], // Cuentas del Departamento
    joined_at: new Date(),
    status: 'active',
    role: GroupRole.ADMIN,
  },
  {
    user: usersSeed[0], // Gonzalo
    group: groupsSeed[1], // Cuentas del Departamento
    joined_at: new Date(),
    status: 'active',
    role: GroupRole.MEMBER,
  },
  {
    user: usersSeed[2], // Laura
    group: groupsSeed[2], // Proyecto de la Facu
    joined_at: new Date(),
    status: 'active',
    role: GroupRole.ADMIN,
  },
  {
    user: usersSeed[3], // Martín
    group: groupsSeed[2], // Proyecto de la Facu
    joined_at: new Date(),
    status: 'active',
    role: GroupRole.MEMBER,
  },
  {
    user: usersSeed[3], // Martín
    group: groupsSeed[3], // Salida de Fin de Semana
    joined_at: new Date(),
    status: 'active',
    role: GroupRole.ADMIN,
  },
  {
    user: usersSeed[0], // Gonzalo
    group: groupsSeed[3], // Salida de Fin de Semana
    joined_at: new Date(),
    status: 'pending',
    role: GroupRole.MEMBER,
  },
];