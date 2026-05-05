import { Test, TestingModule } from '@nestjs/testing';
import { LogoutUseCase } from './logout.use-case';
import { ISESSION_REPOSITORY } from 'src/domain/repository/session.repository';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;

  const mockSessionRepository = {
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutUseCase,
        { provide: ISESSION_REPOSITORY, useValue: mockSessionRepository },
      ],
    }).compile();

    useCase = module.get<LogoutUseCase>(LogoutUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería llamar al repositorio para borrar la sesión con el ID correcto', async () => {
    // Un ID de sesión que viene del token
    const sessionId = 'uuid-de-la-sesion-123';
    mockSessionRepository.delete.mockResolvedValue(undefined); // Prisma delete suele devolver void o el objeto

    await useCase.execute(sessionId);
    expect(mockSessionRepository.delete).toHaveBeenCalledWith(sessionId);
    expect(mockSessionRepository.delete).toHaveBeenCalledTimes(1);
  });
});
