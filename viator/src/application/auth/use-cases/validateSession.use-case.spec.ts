import { Test, TestingModule } from '@nestjs/testing';
import { ValidateSessionUseCase } from './validateSession.use-case';
import { ISESSION_REPOSITORY } from 'src/domain/repository/session.repository';
import { TokenService } from '../helpers/token.service';

describe('ValidateSessionUseCase', () => {
  let useCase: ValidateSessionUseCase;

  const mockSessionRepository = {
    findUnique: jest.fn(),
    updateExpiration: jest.fn(),
  };

  const mockTokenService = {
    getSessionExpiration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateSessionUseCase,
        { provide: ISESSION_REPOSITORY, useValue: mockSessionRepository },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    useCase = module.get<ValidateSessionUseCase>(ValidateSessionUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('debería retornar false si la sesión no existe', async () => {
    mockSessionRepository.findUnique.mockResolvedValue(null);

    const result = (await useCase.execute('id-inexistente')) as boolean;

    expect(result).toBe(false);
    expect(mockSessionRepository.updateExpiration).not.toHaveBeenCalled();
  });

  it('debería retornar false si la sesión ya expiró', async () => {
    const expiredSession = {
      id: '123',
      expiresAt: new Date(Date.now() - 10 * 60 * 1000),
    };
    mockSessionRepository.findUnique.mockResolvedValue(expiredSession);

    const result = (await useCase.execute('123')) as boolean;

    expect(result).toBe(false);
    expect(mockSessionRepository.updateExpiration).not.toHaveBeenCalled();
  });

  it('debería actualizar la expiración (10 min más) y retornar la sesión si es válida', async () => {
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 10);

    const mockSession = {
      id: '123',
      expiresAt: futureDate,
    };

    const nextExpiration = new Date(Date.now() + 10 * 60 * 1000);
    mockSessionRepository.findUnique.mockResolvedValue(mockSession);
    mockSessionRepository.updateExpiration.mockResolvedValue(undefined);
    mockTokenService.getSessionExpiration.mockReturnValue(nextExpiration);

    const result = (await useCase.execute('123')) as boolean;

    expect(result).toEqual(mockSession);
    expect(mockTokenService.getSessionExpiration).toHaveBeenCalledTimes(1);
    expect(mockSessionRepository.updateExpiration).toHaveBeenCalledWith(
      '123',
      nextExpiration,
    );
  });
});

