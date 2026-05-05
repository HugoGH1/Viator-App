import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindAllUsersQuery } from './find-all-users.query';
import { IUSER_REPOSITORY, IUserRepository } from 'src/domain/repository/user.repository';
import { Inject } from '@nestjs/common';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersQueryHandler implements IQueryHandler<FindAllUsersQuery> {
    constructor(
        @Inject(IUSER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }
    async execute(_query: FindAllUsersQuery) {
        return await this.userRepository.findAll();
    }
}
