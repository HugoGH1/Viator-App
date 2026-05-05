import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { IUSER_REPOSITORY } from 'src/domain/repository/user.repository';
import type { IUserRepository } from 'src/domain/repository/user.repository';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import { PasswordService } from '../helpers/password.service';
import { Role } from '@prisma/client';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: RegisterUserDto, role: Role = Role.USER): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser)
      throw new BadRequestException(
        'Ya existe un usuario asociado con este email',
      );
    const passwordHash = await this.passwordService.hash(dto.password);

    return await this.userRepository.register({
      email: dto.email,
      passwordHash: passwordHash,
      name: dto.name,
      role: role,
    });
  }
}
