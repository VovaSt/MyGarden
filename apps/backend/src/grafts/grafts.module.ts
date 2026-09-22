import { Module } from '@nestjs/common';
import { TreesModule } from '../trees/trees.module';
import { VarietiesModule } from '../varieties/varieties.module';
import { GraftsController } from './grafts.controller';
import { GraftsService } from './grafts.service';

@Module({
  imports: [TreesModule, VarietiesModule],
  controllers: [GraftsController],
  providers: [GraftsService],
})
export class GraftsModule {}
