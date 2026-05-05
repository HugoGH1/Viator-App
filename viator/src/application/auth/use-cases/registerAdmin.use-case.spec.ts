import { Test, TestingModule } from '@nestjs/testing';
import { RegisterAdminUseCase } from './registerAdmin.use-case';
import { RegisterUserUseCase } from './registerUser.use-case';
import { Role } from '@prisma/client';

describe('RegisterAdminUseCase', () => {
  let useCase: RegisterAdminUseCase;
  //let registerUserUseCase: RegisterUserUseCase;

  const mockRegisterUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterAdminUseCase,
        {
          provide: RegisterUserUseCase,
          useValue: mockRegisterUserUseCase,
        },
      ],
    }).compile();

    useCase = module.get<RegisterAdminUseCase>(RegisterAdminUseCase);
    // registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería llamar a RegisterUserUseCase con el rol ADMIN', async () => {
    const dto = {
      email: 'admin@ejemplo',
      password: 'admin@123',
      name: 'Hugo Admin',
    };
    const mockUser = { id: 'uuid', ...dto, role: Role.ADMIN };
    mockRegisterUserUseCase.execute.mockResolvedValue(mockUser);

    const result = await useCase.execute(dto);
    expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(
      dto,
      Role.ADMIN,
    );
    expect(result.role).toBe(Role.ADMIN);
    expect(result).toEqual(mockUser);
  });
});
