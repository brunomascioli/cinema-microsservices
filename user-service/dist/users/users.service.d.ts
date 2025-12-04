import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserEntity } from './entities/user.entity';
export declare class UsersService {
    private readonly prisma;
    private readonly saltRounds;
    constructor(prisma: PrismaService);
    create(createUserInput: CreateUserInput): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findById(id: string): Promise<UserEntity>;
    findByEmail(email: string): Promise<User | null>;
    verifyPassword(plain: string, hash: string): Promise<boolean>;
    private hashPassword;
    toEntity(user: User): UserEntity;
}
