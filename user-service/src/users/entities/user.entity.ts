import { Role } from '@prisma/client';

export class UserEntity {
  id!: string;
  email!: string;
  role!: Role;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
