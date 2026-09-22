import { Controller, Get, Query } from '@nestjs/common';
import { HarvestCalendarQueryDto } from './dto/harvest-calendar-query.dto';
import { HarvestCalendarService } from './harvest-calendar.service';

@Controller('harvest-calendar')
export class HarvestCalendarController {
  constructor(private readonly harvestCalendarService: HarvestCalendarService) {}

  @Get()
  getCalendar(@Query() query: HarvestCalendarQueryDto) {
    return this.harvestCalendarService.getCalendar(query);
  }
}
