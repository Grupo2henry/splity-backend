/* eslint-disable prettier/prettier */
export interface JwtPayloadWithUser {
  id: string;
  email?: string;
  [key: string]: any;
}