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

export class UserMembershipWithGroupDetailsDto {
  id: number;
  active: boolean;
  joined_at: Date;
  status: string;
  role: string;
  group: {
    id: number;
    name: string;
    active: boolean;
    emoji: string | null;
    created_at: Date;
    locationName: string | null;
    latitude: number | null;
    longitude: number | null;
    created_by: {
      id: string;
      name: string;
    };
  };
}