import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/context/prisma.service';
import { IUserRepository } from 'src/domain/repository/user.repository';
import { User } from 'src/domain/entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async register(user: Prisma.UserCreateInput): Promise<User> {
    const savedUser = await this.prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        role: user.role,
      },
    });

    return new User(
      savedUser.id,
      savedUser.email,
      savedUser.passwordHash,
      savedUser.name,
      savedUser.role,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(
      user.id,
      user.email,
      user.passwordHash,
      user.name,
      user.role,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(
      user.id,
      user.email,
      user.passwordHash,
      user.name,
      user.role,
    );
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(
      (u) => new User(u.id, u.email, u.passwordHash, u.name, u.role),
    );
  }
}
