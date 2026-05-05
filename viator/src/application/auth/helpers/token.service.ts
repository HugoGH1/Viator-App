import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/* istanbul ignore next */
@Injectable()
export class TokenService {
  private readonly sessionDurationMinutes = 10;

  hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  getSessionExpiration(minutes: number = this.sessionDurationMinutes): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}
