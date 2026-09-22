import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GardensModule } from './gardens/gardens.module';
import { GraftsModule } from './grafts/grafts.module';
import { HarvestCalendarModule } from './harvest-calendar/harvest-calendar.module';
import { MapObjectsModule } from './map-objects/map-objects.module';
import { PrismaModule } from './prisma/prisma.module';
import { SpeciesModule } from './species/species.module';
import { TreesModule } from './trees/trees.module';
import { VarietiesModule } from './varieties/varieties.module';

@Module({
  imports: [PrismaModule, GardensModule, SpeciesModule, VarietiesModule, TreesModule, GraftsModule, MapObjectsModule, HarvestCalendarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
