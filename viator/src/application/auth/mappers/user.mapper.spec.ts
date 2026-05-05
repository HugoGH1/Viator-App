import { User } from 'src/domain/entities/user.entity';
import { Role } from '@prisma/client';
import { UserMapper } from './user.mapper';

describe('UserMapper', () => {
  const mockUser = new User(
    'uuid-001',
    'test@itd.mx',
    'hashed_password',
    'Test User',
    Role.USER,
  );

  describe('toResponse', () => {
    it('debería mapear un User a un objeto de respuesta sin password', () => {
      const result = UserMapper.toResponse(mockUser);

      expect(result).toEqual({
        id: 'uuid-001',
        email: 'test@itd.mx',
        name: 'Test User',
        role: Role.USER,
      });
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('_password');
    });
  });

  describe('toResponseList', () => {
    it('debería mapear una lista de Users a una lista de DTOs de respuesta', () => {
      const adminUser = new User(
        'uuid-002',
        'admin@itd.mx',
        'hash_admin',
        'Admin User',
        Role.ADMIN,
      );

      const result = UserMapper.toResponseList([mockUser, adminUser]);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'uuid-001',
        email: 'test@itd.mx',
        name: 'Test User',
        role: Role.USER,
      });
      expect(result[1]).toEqual({
        id: 'uuid-002',
        email: 'admin@itd.mx',
        name: 'Admin User',
        role: Role.ADMIN,
      });
    });

    it('debería retornar una lista vacía cuando se pasa un arreglo vacío', () => {
      const result = UserMapper.toResponseList([]);
      expect(result).toEqual([]);
    });
  });
});
