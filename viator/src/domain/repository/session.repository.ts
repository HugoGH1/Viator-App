import { Session } from '@prisma/client';

export interface ISessionRepository {
  create(userId: string, expiresAt: Date, tokenHash: string): Promise<Session>;
  updateHash(sessionId: string, tokenHash: string): Promise<void>;
  updateExpiration(sessionId: string, newExpiration: Date): Promise<void>;
  findUnique(id: string): Promise<{
    id: string;
    userId: string;
    expiresAt: Date;
    tokenHash: string;
  } | null>;
  delete(id: string): Promise<void>;
}

export const ISESSION_REPOSITORY = Symbol('ISessionRepository');
