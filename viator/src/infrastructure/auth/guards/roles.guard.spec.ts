import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

const createMockExecutionContext = (user?: {
  role: Role;
}): ExecutionContext => {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ user }),
    }),
  } as unknown as ExecutionContext;
};

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('debería permitir el acceso cuando no hay roles requeridos', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockExecutionContext();

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('debería permitir el acceso cuando el usuario tiene el rol requerido', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN] as Role[]);
    const context = createMockExecutionContext({ role: Role.ADMIN });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('debería lanzar ForbiddenException cuando el usuario tiene un rol diferente al requerido', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN] as Role[]);
    const context = createMockExecutionContext({ role: Role.USER });

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('No tienes permiso para realizar esta acción'),
    );
  });

  it('debería lanzar ForbiddenException cuando no hay usuario en el request', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN] as Role[]);
    const context = createMockExecutionContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('No tienes permiso para realizar esta acción'),
    );
  });

  it('debería verificar los metadatos usando ROLES_KEY en el handler y la clase', () => {
    const getAllAndOverrideSpy = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.USER] as Role[]);
    const context = createMockExecutionContext({ role: Role.USER });

    guard.canActivate(context);

    expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });
});
