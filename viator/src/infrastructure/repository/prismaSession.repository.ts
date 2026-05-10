import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/context/prisma.service';
import { PrismaReadService } from '../prisma/context/prisma-read.service';
import { ISessionRepository } from 'src/domain/repository/session.repository';
import { Session } from '@prisma/client';

@Injectable()
export class PrismaSessionRepository implements ISessionRepository {
  private readonly logger = new Logger(PrismaSessionRepository.name);

  constructor(
    private readonly prisma: PrismaService,         // Writes → MySQL
    private readonly prismaRead: PrismaReadService,  // Reads → PostgreSQL
  ) {}

  // ─── WRITES (MySQL Primary) ───────────────────────────────────────────

  async create(
    userId: string,
    expiresAt: Date,
    tokenHash: string,
  ): Promise<Session> {
    return await this.prisma.session.create({
      data: {
        userId,
        expiresAt,
        tokenHash,
      },
    });
  }

  async updateExpiration(id: string, newExpiresAt: Date): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { expiresAt: newExpiresAt },
    });
  }

  async updateHash(id: string, tokenHash: string): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { tokenHash },
    });
  }

  async delete(id: string): Promise<void> {
    // Esto lo vamos a dejar para cuando implemente el logout
    await this.prisma.session.delete({
      where: { id },
    });
  }

  // ─── READS (PostgreSQL Replica) ───────────────────────────────────────

  async findUnique(sessionId: string): Promise<Session | null> {
    try {
      return await this.prismaRead.session.findUnique({
        where: { id: sessionId },
        include: {
          user: true,
        },
      }) as Session | null;
    } catch {
      this.logger.warn('Read replica unavailable, falling back to primary');
      return await this.prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          user: true,
        },
      });
    }
  }
}
