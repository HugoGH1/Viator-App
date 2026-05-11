import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ValidateSessionUseCase } from 'src/application/auth/use-cases/validateSession.use-case';
import { JwtPayload } from 'src/infrastructure/auth/types/jwt-payload.type';

interface SessionWithUser {
  id: string;
  userId: string;
  user: {
    email: string;
    role: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private validateSessionUseCase: ValidateSessionUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secreto-hardcodeado',
    });
  }

  async validate(payload: JwtPayload) {
    const session = (await this.validateSessionUseCase.execute(
      payload.sub,
    )) as SessionWithUser;
    if (!session) throw new UnauthorizedException('Sesión inválida o expirada');

    return {
      sessionId: session.id,
      userId: session.userId,
      email: session.user.email,
      role: session.user.role,
    };
  }
}
