/* eslint-disable prettier/prettier */
// src/user/dto/users-memberships.dto.ts

export class UsersMembershipsDto {
  id: number;
  active: boolean;
  joined_at: Date;
  status: string;
  role: string;
  group: {
    id: number;
    name: string;
    active: boolean;
    emoji?: string; // Hazlo opcional si no siempre está presente
  };
}