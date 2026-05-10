import { Injectable, Inject } from '@nestjs/common';
import {
  ISESSION_REPOSITORY,
  ISessionRepository,
} from 'src/domain/repository/session.repository';
@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(ISESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) { }

  async execute(id: string): Promise<void> {
    const session = await this.sessionRepository.findUnique(id);
    if (!session) return;

    await this.sessionRepository.delete(id);
  }
}
