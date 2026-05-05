import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/registerUser.use-case';
import { FindAllUsersUseCase } from 'src/application/auth/use-cases/findAllUsers.use-case';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { RegisterAdminUseCase } from 'src/application/auth/use-cases/registerAdmin.use-case';
import { LogoutUseCase } from 'src/application/auth/use-cases/logout.use-case';
import { Role } from '@prisma/client';
import { User } from 'src/domain/entities/user.entity';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/infrastructure/auth/guards/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('AuthController', () => {
  let controller: AuthController;

  const mockRegisterUserUseCase = { execute: jest.fn() };
  const mockFindAllUsersUseCase = { execute: jest.fn() };
  const mockLoginUseCase = { execute: jest.fn() };
  const mockRegisterAdminUseCase = { execute: jest.fn() };
  const mockLogoutUseCase = { execute: jest.fn() };

  // Helper para crear usuarios de dominio
  const makeUser = (
    id: string,
    email: string,
    name: string,
    role: Role,
  ): User => new User(id, email, 'hash', name, role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: RegisterUserUseCase, useValue: mockRegisterUserUseCase },
        { provide: FindAllUsersUseCase, useValue: mockFindAllUsersUseCase },
        { provide: LoginUseCase, useValue: mockLoginUseCase },
        { provide: RegisterAdminUseCase, useValue: mockRegisterAdminUseCase },
        { provide: LogoutUseCase, useValue: mockLogoutUseCase },
      ],
    })
      // Desactivamos los guards para probar la lógica del controller sin autenticación
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllUsers()', () => {
    it('debería retornar la lista de usuarios mapeada', async () => {
      const users = [
        makeUser('1', 'admin@ejemplo.com', 'Hugo Admin', Role.ADMIN),
        makeUser('2', 'user@ejemplo.com', 'Hugo User', Role.USER),
      ];
      mockFindAllUsersUseCase.execute.mockResolvedValue(users);

      const result = await controller.findAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '1',
        email: 'admin@ejemplo.com',
        name: 'Hugo Admin',
        role: Role.ADMIN,
      });
      expect(result[0]).not.toHaveProperty('password');
    });
  });

  describe('register()', () => {
    it('debería registrar un usuario y retornar el DTO de respuesta', async () => {
      const dto = {
        email: 'test@ejemplo.com',
        password: 'pass123',
        name: 'User test',
      };
      const createdUser = makeUser('3', 'test@ejemplo.com', 'User test', Role.USER);
      mockRegisterUserUseCase.execute.mockResolvedValue(createdUser);

      const result = await controller.register(dto);

      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: '3',
        email: 'test@ejemplo.com',
        name: 'User test',
        role: Role.USER,
      });
    });
  });

  describe('registerAdmin()', () => {
    it('debería registrar un admin y retornar el DTO de respuesta', async () => {
      const dto = {
        email: 'admin@test.com',
        password: 'admin123',
        name: 'Admin',
      };
      const createdAdmin = makeUser(
        '4',
        'admin@test.com',
        'Admin',
        Role.ADMIN,
      );
      mockRegisterAdminUseCase.execute.mockResolvedValue(createdAdmin);

      const result = await controller.registerAdmin(dto);

      expect(mockRegisterAdminUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: '4',
        email: 'admin@test.com',
        name: 'Admin',
        role: Role.ADMIN,
      });
    });
  });

  describe('login()', () => {
    it('debería retornar el access_token y los datos del usuario', async () => {
      const dto = { email: 'admin@ejemplo.com', password: 'admin@123' };
      const loginResponse = {
        access_token: 'jwt_token',
        user: { id: '1', email: 'admin@ejemplo.com', name: 'Hugo Admin', role: 'ADMIN' },
      };
      mockLoginUseCase.execute.mockResolvedValue(loginResponse);

      const result = await controller.login(dto);

      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(loginResponse);
    });
  });

  describe('logout()', () => {
    it('debería cerrar la sesión y retornar el mensaje de confirmación', async () => {
      mockLogoutUseCase.execute.mockResolvedValue(undefined);
      const req = { user: { sessionId: 'session-xyz' } };

      const result = await controller.logout(req);

      expect(mockLogoutUseCase.execute).toHaveBeenCalledWith('session-xyz');
      expect(result).toEqual({ message: 'Sesión cerrada exitosamente' });
    });
  });
});
