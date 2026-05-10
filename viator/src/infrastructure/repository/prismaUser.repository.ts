import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/context/prisma.service';
import { PrismaReadService } from '../prisma/context/prisma-read.service';
import { IUserRepository } from 'src/domain/repository/user.repository';
import { User } from 'src/domain/entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private readonly logger = new Logger(PrismaUserRepository.name);

  constructor(
    private readonly prisma: PrismaService,         // Writes → MySQL
    private readonly prismaRead: PrismaReadService,  // Reads → PostgreSQL
  ) {}

  // ─── WRITE (MySQL Primary) ────────────────────────────────────────────

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

  // ─── READS (PostgreSQL Replica) ───────────────────────────────────────

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prismaRead.user.findUnique({ where: { email } });
      if (!user) return null;
      return new User(
        user.id,
        user.email,
        user.passwordHash,
        user.name,
        user.role,
      );
    } catch {
      this.logger.warn('Read replica unavailable, falling back to primary');
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
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.prismaRead.user.findUnique({ where: { id } });
      if (!user) return null;
      return new User(
        user.id,
        user.email,
        user.passwordHash,
        user.name,
        user.role,
      );
    } catch {
      this.logger.warn('Read replica unavailable, falling back to primary');
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
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.prismaRead.user.findMany();
      return users.map(
        (u) => new User(u.id, u.email, u.passwordHash, u.name, u.role),
      );
    } catch {
      this.logger.warn('Read replica unavailable, falling back to primary');
      const users = await this.prisma.user.findMany();
      return users.map(
        (u) => new User(u.id, u.email, u.passwordHash, u.name, u.role),
      );
    }
  }
}
