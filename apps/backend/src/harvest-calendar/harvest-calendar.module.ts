import { Module } from '@nestjs/common';
import { GardensModule } from '../gardens/gardens.module';
import { HarvestCalendarController } from './harvest-calendar.controller';
import { HarvestCalendarService } from './harvest-calendar.service';

@Module({
  imports: [GardensModule],
  controllers: [HarvestCalendarController],
  providers: [HarvestCalendarService],
})
export class HarvestCalendarModule {}
