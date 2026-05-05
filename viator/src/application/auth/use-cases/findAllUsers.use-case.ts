import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { IUSER_REPOSITORY } from 'src/domain/repository/user.repository';
import type { IUserRepository } from 'src/domain/repository/user.repository';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
