import { Module } from '@nestjs/common';
import { GardensModule } from '../gardens/gardens.module';
import { SpeciesModule } from '../species/species.module';
import { GardenTreesController } from './garden-trees.controller';
import { TreesController } from './trees.controller';
import { TreesService } from './trees.service';

@Module({
  imports: [GardensModule, SpeciesModule],
  controllers: [GardenTreesController, TreesController],
  providers: [TreesService],
  exports: [TreesService],
})
export class TreesModule {}
