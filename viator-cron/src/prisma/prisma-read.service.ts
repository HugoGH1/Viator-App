import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/read-client';

@Injectable()
export class PrismaReadService extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect();
    }
}