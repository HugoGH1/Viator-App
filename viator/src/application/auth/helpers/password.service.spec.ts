import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('debería llamar a bcrypt.hash con la contraseña y 10 salt rounds', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await service.hash('mi_password');

      expect(bcrypt.hash).toHaveBeenCalledWith('mi_password', 10);
      expect(result).toBe('hashed_password');
    });
  });

  describe('compare', () => {
    it('debería retornar true si la contraseña coincide con el hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.compare('plain', 'hashed');

      expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
      expect(result).toBe(true);
    });

    it('debería retornar false si la contraseña no coincide con el hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.compare('wrong', 'hashed');

      expect(result).toBe(false);
    });
  });
});
