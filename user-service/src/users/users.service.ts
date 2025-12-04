import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput): Promise<UserEntity> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: createUserInput.email } });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado.');
    }

    const password = await this.hashPassword(createUserInput.password);
    const role: Role = createUserInput.role ?? Role.USER;

    const user = await this.prisma.user.create({
      data: {
        email: createUserInput.email,
        password,
        role,
      },
    });

    return this.toEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map((user) => this.toEntity(user));
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.toEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  private async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  toEntity(user: User): UserEntity {
    const { password, ...safeUser } = user;
    return new UserEntity(safeUser);
  }
}
