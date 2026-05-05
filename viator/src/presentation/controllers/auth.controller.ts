import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserDto } from '../../application/auth/dtos/registerUser.dto';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/registerUser.use-case';
import { UserMapper } from 'src/application/auth/mappers/user.mapper';
import { FindAllUsersUseCase } from 'src/application/auth/use-cases/findAllUsers.use-case';
import { LoginUserDto } from 'src/application/auth/dtos/loginUser.dto';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { RegisterAdminUseCase } from 'src/application/auth/use-cases/registerAdmin.use-case';
import { RolesGuard } from 'src/infrastructure/auth/guards/roles.guard';
import { Roles } from 'src/infrastructure/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { LogoutUseCase } from 'src/application/auth/use-cases/logout.use-case';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FindAllUsersQuery } from 'src/application/auth/queries/find-all-users/find-all-users.query';
import { RegisterUserCommand } from 'src/application/auth/commands/register-user/register-user.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserCase: RegisterUserUseCase,
    private readonly findAllUsersCase: FindAllUsersUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly registerAdminCase: RegisterAdminUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('users')
  async findAllUsers() {
    const users = await this.queryBus.execute(new FindAllUsersQuery());
    return UserMapper.toResponseList(users);
  }

  /*@Get('users/{id}')
  async findUserById(@Param('id') id) {
    return this.authService.findUserById(id);
  } */

  @Post('users/add')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.commandBus.execute(new RegisterUserCommand(dto.email, dto.password, dto.name));

    return UserMapper.toResponse(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('users/add-admin')
  async registerAdmin(@Body() dto: RegisterUserDto) {
    const admin = await this.registerAdminCase.execute(dto);
    return UserMapper.toResponse(admin);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return await this.loginUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: { user: { sessionId: string } }) {
    await this.logoutUseCase.execute(req.user.sessionId);
    return { message: 'Sesión cerrada exitosamente' };
  }
}
