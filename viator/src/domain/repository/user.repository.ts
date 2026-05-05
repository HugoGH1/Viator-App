import { Prisma } from '@prisma/client';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  register(user: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}

export const IUSER_REPOSITORY = Symbol('IUserRepository');
