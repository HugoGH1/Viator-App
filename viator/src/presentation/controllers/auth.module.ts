import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
//import { JwtStrategy } from '../../auth/jwt.strategy';
import { IUSER_REPOSITORY } from 'src/domain/repository/user.repository';
import { PrismaModule } from 'src/infrastructure/prisma/context/prisma.module';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/registerUser.use-case';
import { PrismaUserRepository } from 'src/infrastructure/repository/prismaUser.repository';
import { PrismaSessionRepository } from 'src/infrastructure/repository/prismaSession.repository';
import { FindAllUsersUseCase } from 'src/application/auth/use-cases/findAllUsers.use-case';
import { ISESSION_REPOSITORY } from 'src/domain/repository/session.repository';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { ValidateSessionUseCase } from 'src/application/auth/use-cases/validateSession.use-case';
import { ConfigService } from '@nestjs/config';
import { RegisterAdminUseCase } from 'src/application/auth/use-cases/registerAdmin.use-case';
import { JwtStrategy } from 'src/infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/infrastructure/auth/guards/roles.guard';
import { LogoutUseCase } from 'src/application/auth/use-cases/logout.use-case';
import { PasswordService } from 'src/application/auth/helpers/password.service';
import { TokenService } from 'src/application/auth/helpers/token.service';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterUserCommandHandler } from 'src/application/auth/commands/register-user/register-user.handler';
import { FindAllUsersQueryHandler } from 'src/application/auth/queries/find-all-users/find-all-users.handler';
import { RefreshSessionActivityUseCase } from 'src/application/auth/use-cases/refreshSessionAct.use-case';

export const CommandHandlers = [
  RegisterUserCommandHandler,
  //RegisterAdminHandler,
  //LoginHandler,
  //LogoutHandler,
];
export const QueryHandlers = [
  FindAllUsersQueryHandler,
  //ValidateSessionHandler,
];

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'super-secreto-hardcodeado',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    FindAllUsersUseCase,
    RegisterUserUseCase,
    LoginUseCase,
    LogoutUseCase,
    ValidateSessionUseCase,
    RegisterAdminUseCase,
    RefreshSessionActivityUseCase,
    PasswordService,
    TokenService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: IUSER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: ISESSION_REPOSITORY,
      useClass: PrismaSessionRepository,
    },
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule { }
