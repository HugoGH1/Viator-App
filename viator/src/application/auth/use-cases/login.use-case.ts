import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  IUSER_REPOSITORY,
  IUserRepository,
} from 'src/domain/repository/user.repository';
import { ISESSION_REPOSITORY } from 'src/domain/repository/session.repository';
import type { ISessionRepository } from 'src/domain/repository/session.repository';
import { LoginResponse } from './loginResponse';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { UserMapper } from '../mappers/user.mapper';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../helpers/password.service';
import { TokenService } from '../helpers/token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(ISESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,

    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isValidPassword = await this.passwordService.compare(
      dto.password,
      user.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('Credenciales inválidas');

    const expiresAt = this.tokenService.getSessionExpiration();
    const session = await this.sessionRepository.create(
      user.id,
      expiresAt,
      'tokenHash',
    );
    const payload = { sub: session.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const tokenHash = this.tokenService.hash(accessToken);

    await this.sessionRepository.updateHash(session.id, tokenHash);

    return {
      access_token: accessToken,
      user: UserMapper.toResponse(user),
    };
  }
}
