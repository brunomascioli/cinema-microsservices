import { Role } from '@prisma/client';

export interface ActiveUserData {
  sub: string;
  email: string;
  role: Role;
}
