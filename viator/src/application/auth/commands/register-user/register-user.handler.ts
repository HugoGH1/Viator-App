import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { PasswordService } from '../../helpers/password.service';
import { IUSER_REPOSITORY } from 'src/domain/repository/user.repository';
import { IUserRepository } from 'src/domain/repository/user.repository';
import { Inject, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<any> {
    const { email, password, name } = command;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser)
      throw new BadRequestException(
        'Ya existe un usuario asociado con este email',
      );
    const passwordHash = await this.passwordService.hash(password);

    return await this.userRepository.register({
      email: email,
      passwordHash: passwordHash,
      name: name,
      role: Role.USER,
    });
  }
}
