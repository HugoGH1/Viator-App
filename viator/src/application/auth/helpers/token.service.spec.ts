import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  describe('hash', () => {
    it('debería retornar el hash SHA-256 del token en hexadecimal', () => {
      const token = 'mi_access_token';
      const result = service.hash(token);

      // SHA-256 produce siempre 64 caracteres hex
      expect(result).toHaveLength(64);
      expect(result).toMatch(/^[a-f0-9]+$/);
    });

    it('debería producir el mismo hash para el mismo input (determinístico)', () => {
      const token = 'mismo_token';
      expect(service.hash(token)).toBe(service.hash(token));
    });

    it('debería producir hashes distintos para inputs distintos', () => {
      expect(service.hash('token_a')).not.toBe(service.hash('token_b'));
    });
  });

  describe('getSessionExpiration', () => {
    it('debería retornar una Date 10 minutos en el futuro por defecto', () => {
      const before = Date.now();
      const expiration = service.getSessionExpiration();
      const after = Date.now();

      const expectedMin = before + 10 * 60 * 1000;
      const expectedMax = after + 10 * 60 * 1000;

      expect(expiration.getTime()).toBeGreaterThanOrEqual(expectedMin);
      expect(expiration.getTime()).toBeLessThanOrEqual(expectedMax);
    });

    it('debería respetar los minutos pasados como parámetro', () => {
      const before = Date.now();
      const expiration = service.getSessionExpiration(30);
      const after = Date.now();

      const expectedMin = before + 30 * 60 * 1000;
      const expectedMax = after + 30 * 60 * 1000;

      expect(expiration.getTime()).toBeGreaterThanOrEqual(expectedMin);
      expect(expiration.getTime()).toBeLessThanOrEqual(expectedMax);
    });
  });
});
