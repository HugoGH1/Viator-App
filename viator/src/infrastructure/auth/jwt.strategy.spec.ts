import { JwtStrategy } from './jwt.strategy';
import { ValidateSessionUseCase } from 'src/application/auth/use-cases/validateSession.use-case';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockValidateSessionUseCase: { execute: jest.Mock };

  beforeEach(() => {
    mockValidateSessionUseCase = { execute: jest.fn() };

    strategy = new JwtStrategy(
      mockValidateSessionUseCase as unknown as ValidateSessionUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar los datos del usuario cuando la sesión es válida', async () => {
    const mockSession = {
      id: 'session-123',
      userId: 'user-456',
      user: {
        email: 'test@itd.mx',
        role: 'USER',
      },
    };
    mockValidateSessionUseCase.execute.mockResolvedValue(mockSession);

    const payload = {
      sub: 'session-123',
      email: 'test@itd.mx',
      role: 'USER',
      sid: 'session-123',
    };

    const result = await strategy.validate(payload);

    expect(mockValidateSessionUseCase.execute).toHaveBeenCalledWith(
      'session-123',
    );
    expect(result).toEqual({
      sessionId: 'session-123',
      userId: 'user-456',
      email: 'test@itd.mx',
      role: 'USER',
    });
  });

  it('debería lanzar UnauthorizedException cuando la sesión es inválida o expirada', async () => {
    mockValidateSessionUseCase.execute.mockResolvedValue(false);

    const payload = {
      sub: 'session-invalida',
      email: 'test@itd.mx',
      role: 'USER',
      sid: 'session-invalida',
    };

    await expect(strategy.validate(payload)).rejects.toThrow(
      new UnauthorizedException('Sesión inválida o expirada'),
    );
  });
});
