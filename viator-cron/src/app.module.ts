import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionCleanupService } from './tasks/session-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [SessionCleanupService],
})
export class AppModule { }
