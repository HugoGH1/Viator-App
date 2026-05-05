import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUsersUseCase } from './findAllUsers.use-case';
import { IUSER_REPOSITORY } from 'src/domain/repository/user.repository';
import { Role } from '@prisma/client';

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;

  const mockUserRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUsersUseCase,
        { provide: IUSER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar una lista de usuarios correctamente', async () => {
    const mockUsers = [
      {
        id: '1',
        email: 'admin@ejemplo.com',
        name: 'Hugo Admin',
        role: Role.ADMIN,
      },
      {
        id: '2',
        email: 'user@ejemplo.com',
        name: 'Hugo User',
        role: Role.USER,
      },
    ];
    mockUserRepository.findAll.mockResolvedValue(mockUsers);

    const result = await useCase.execute();

    expect(result).toEqual(mockUsers);
    expect(result).toHaveLength(2);
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('debería retornar una lista vacía cuando no hay usuarios', async () => {
    mockUserRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
