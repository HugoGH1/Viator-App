/*import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../infrastructure/prisma/context/prisma.service';
import { JwtPayload } from '../infrastructure/auth/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
    });
    return { message: 'User registered successfully', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: '',
        expiresAt,
      },
    });

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      sid: session.id,
    };

    const token = this.jwtService.sign(payload);
    const tokenHash = await bcrypt.hash(token, 10);
    await this.prisma.session.update({
      where: { id: session.id },
      data: { tokenHash },
    });

    return { access_token: token };
  }

  async validateUser(payload: JwtPayload) {
    return await this.prisma.user.findUnique({ where: { id: payload.sub } });
  }

  async validateSession(token: string, payload: JwtPayload) {
    const session = await this.prisma.session.findUnique({
      where: { id: payload.sid },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session termianda o no encontrada');
    }

    const isValid = await bcrypt.compare(token, session.tokenHash);
    if (!isValid) throw new UnauthorizedException('Invalid session');

    return this.validateUser(payload);
  }
}
*/
