import { Inject, Injectable } from '@nestjs/common';
import { ISESSION_REPOSITORY } from 'src/domain/repository/session.repository';
import type { ISessionRepository } from 'src/domain/repository/session.repository';
import { TokenService } from '../helpers/token.service';

@Injectable()
export class ValidateSessionUseCase {
  constructor(
    @Inject(ISESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(sessionId: string): Promise<any> {
    const session = await this.sessionRepository.findUnique(sessionId);

    if (!session || new Date() > session.expiresAt) return false;

    const nextExpiration = this.tokenService.getSessionExpiration();
    await this.sessionRepository.updateExpiration(sessionId, nextExpiration);

    return session;
  }
}
