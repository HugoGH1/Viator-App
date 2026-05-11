import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PathTraversalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const checkPayload = (payload: any): boolean => {
      if (!payload) return false;

      if (typeof payload === 'string') {
        const maliciousPatterns = [
          /\.\.\//,         // ../
          /\.\.\\/,         // ..\
          /%2e%2e/i,        // %2e%2e
          /^\//,            // Rutas absolutas que inician con /
          /^[a-zA-Z]:/,     // Letras de unidad en Windows (C:, D:, etc.)
          /\/etc\//i,       // Referencias a /etc/
          /\/windows\//i,   // Referencias a /windows/
        ];

        return maliciousPatterns.some(pattern => pattern.test(payload));
      }

      if (typeof payload === 'object') {
        for (const key in payload) {
          if (Object.prototype.hasOwnProperty.call(payload, key)) {
            if (checkPayload(payload[key])) {
              return true;
            }
          }
        }
      }

      return false;
    };

    if (checkPayload(request.query) || checkPayload(request.body)) {
      throw new BadRequestException('Ruta de archivo maliciosa detectada');
    }

    return true;
  }
}
