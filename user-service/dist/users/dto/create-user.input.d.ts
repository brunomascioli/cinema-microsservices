import { Role } from '@prisma/client';
export declare class CreateUserInput {
    email: string;
    password: string;
    role?: Role;
}
