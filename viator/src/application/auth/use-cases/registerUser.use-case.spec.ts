import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from './registerUser.use-case';
import { IUSER_REPOSITORY } from 'src/domain/repository/user.repository';
import { BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PasswordService } from '../helpers/password.service';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    register: jest.fn(),
  };

  const mockPasswordService = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        { provide: IUSER_REPOSITORY, useValue: mockUserRepository },
        { provide: PasswordService, useValue: mockPasswordService },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería lanzar BadRequestException si el email ya está registrado', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: '1',
      email: 'ya-existe@itd.mx',
    });

    const dto = { email: 'ya-existe@itd.mx', password: '123', name: 'Juan' };

    await expect(useCase.execute(dto)).rejects.toThrow(
      new BadRequestException('Ya existe un usuario asociado con este email'),
    );
    expect(mockUserRepository.register).not.toHaveBeenCalled();
  });

  it('debería hashear la contraseña y registrar al usuario con rol USER por defecto', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordService.hash.mockResolvedValue('password_hasheado_123');

    const mockCreatedUser = {
      id: 'new-uuid',
      email: 'nuevo@itd.mx',
      name: 'Nuevo',
      role: Role.USER,
    };
    mockUserRepository.register.mockResolvedValue(mockCreatedUser);

    const dto = {
      email: 'nuevo@itd.mx',
      password: 'password-plano',
      name: 'Nuevo',
    };

    const result = await useCase.execute(dto);

    expect(mockPasswordService.hash).toHaveBeenCalledWith('password-plano');
    expect(mockUserRepository.register).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'nuevo@itd.mx',
        passwordHash: 'password_hasheado_123',
        name: 'Nuevo',
        role: Role.USER,
      }),
    );
    expect(result).toEqual(mockCreatedUser);
  });

  it('debería registrar al usuario con rol ADMIN cuando se pasa explícitamente', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordService.hash.mockResolvedValue('hash_admin');

    const mockAdminUser = {
      id: 'admin-uuid',
      email: 'admin@itd.mx',
      name: 'Admin',
      role: Role.ADMIN,
    };
    mockUserRepository.register.mockResolvedValue(mockAdminUser);

    const dto = {
      email: 'admin@itd.mx',
      password: 'admin123',
      name: 'Admin',
    };

    const result = await useCase.execute(dto, Role.ADMIN);

    expect(mockUserRepository.register).toHaveBeenCalledWith(
      expect.objectContaining({ role: Role.ADMIN }),
    );
    expect(result.role).toBe(Role.ADMIN);
  });
});

