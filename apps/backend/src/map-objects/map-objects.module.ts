import { Module } from '@nestjs/common';
import { GardensModule } from '../gardens/gardens.module';
import { MapObjectsController } from './map-objects.controller';
import { MapObjectsService } from './map-objects.service';

@Module({
  imports: [GardensModule],
  controllers: [MapObjectsController],
  providers: [MapObjectsService],
})
export class MapObjectsModule {}
