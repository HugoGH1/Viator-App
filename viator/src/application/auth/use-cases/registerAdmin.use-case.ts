import { Injectable } from '@nestjs/common';
import { RegisterUserUseCase } from './registerUser.use-case';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import { User } from 'src/domain/entities/user.entity';
import { Role } from '@prisma/client';

@Injectable()
export class RegisterAdminUseCase {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    return await this.registerUseCase.execute(dto, Role.ADMIN);
  }
}
