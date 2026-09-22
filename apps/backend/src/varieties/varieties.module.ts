import { Module } from '@nestjs/common';
import { SpeciesModule } from '../species/species.module';
import { VarietiesController } from './varieties.controller';
import { VarietySourcesController } from './variety-sources.controller';
import { VarietiesService } from './varieties.service';

@Module({
  imports: [SpeciesModule],
  controllers: [VarietiesController, VarietySourcesController],
  providers: [VarietiesService],
  exports: [VarietiesService],
})
export class VarietiesModule {}
