import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { IUSER_REPOSITORY } from 'src/domain/repository/user.repository';
import { ISESSION_REPOSITORY } from 'src/domain/repository/session.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../helpers/password.service';
import { TokenService } from '../helpers/token.service';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  const mockUserRepository = { findByEmail: jest.fn() };
  const mockSessionRepository = { create: jest.fn(), updateHash: jest.fn() };
  const mockJwtService = { sign: jest.fn() };
  const mockPasswordService = { compare: jest.fn() };
  const mockTokenService = {
    hash: jest.fn(),
    getSessionExpiration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: IUSER_REPOSITORY, useValue: mockUserRepository },
        { provide: ISESSION_REPOSITORY, useValue: mockSessionRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'fake@itd.edu.mx', password: '123' }),
    ).rejects.toThrow(new UnauthorizedException('Credenciales inválidas'));

    expect(mockSessionRepository.create).not.toHaveBeenCalled();
  });

  it('debería lanzar UnauthorizedException si la contraseña no coincide', async () => {
    const mockUser = { id: '1', email: 'test@itd.mx', password: 'hash' };
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockPasswordService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'test@itd.mx', password: 'wrong' }),
    ).rejects.toThrow(new UnauthorizedException('Credenciales inválidas'));

    expect(mockSessionRepository.create).not.toHaveBeenCalled();
  });

  it('debería retornar access_token y datos del usuario si las credenciales son válidas', async () => {
    const mockUser = {
      id: 'uuid-123',
      email: 'admin@ejemplo.com',
      password: 'hash_super_secreto',
      name: 'Admin',
      role: 'ADMIN',
    };
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockPasswordService.compare.mockResolvedValue(true);
    mockTokenService.getSessionExpiration.mockReturnValue(new Date());
    mockSessionRepository.create.mockResolvedValue({ id: 'session-456' });
    mockJwtService.sign.mockReturnValue('token_de_prueba');
    mockTokenService.hash.mockReturnValue('hash_sha256_del_token');
    mockSessionRepository.updateHash.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'admin@ejemplo.com',
      password: 'password123',
    });

    expect(result).toHaveProperty('access_token', 'token_de_prueba');
    expect(result).toHaveProperty('user');
    expect(result.user).toMatchObject({
      id: 'uuid-123',
      email: 'admin@ejemplo.com',
    });
    expect(mockSessionRepository.create).toHaveBeenCalledTimes(1);
    expect(mockTokenService.hash).toHaveBeenCalledWith('token_de_prueba');
    expect(mockSessionRepository.updateHash).toHaveBeenCalledWith(
      'session-456',
      'hash_sha256_del_token',
    );
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: 'session-456',
      email: 'admin@ejemplo.com',
    });
  });
});
