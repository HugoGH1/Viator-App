import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';
import { PrismaReadService } from './prisma/prisma-read.service';
import { SessionCleanupService } from './tasks/session-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [PrismaService, PrismaReadService, SessionCleanupService],
})
export class AppModule { }
