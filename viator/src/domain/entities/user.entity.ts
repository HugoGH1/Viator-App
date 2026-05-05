import { Role } from '@prisma/client';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private _password: string,
    public readonly name: string,
    public readonly role: Role,
  ) {}

  get password(): string {
    return this._password;
  }
}
