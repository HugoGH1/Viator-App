import { User } from 'src/domain/entities/user.entity';

export class UserMapper {
  static toResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  static toResponseList(users: User[]) {
    return users.map((user) => this.toResponse(user));
  }
}
