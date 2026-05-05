import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/context/prisma.service';
import { ISessionRepository } from 'src/domain/repository/session.repository';
import { Session } from '@prisma/client';

@Injectable()
export class PrismaSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async findUnique(sessionId: string): Promise<Session | null> {
    return await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
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
}
