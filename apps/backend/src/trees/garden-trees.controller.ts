import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateTreeDto } from './dto/create-tree.dto';
import { TreesService } from './trees.service';

@Controller('gardens/:gardenId/trees')
export class GardenTreesController {
  constructor(private readonly treesService: TreesService) {}

  @Post()
  create(@Param('gardenId', new ParseUUIDPipe()) gardenId: string, @Body() createTreeDto: CreateTreeDto) {
    return this.treesService.create(gardenId, createTreeDto);
  }

  @Get()
  findAll(@Param('gardenId', new ParseUUIDPipe()) gardenId: string) {
    return this.treesService.findAllByGarden(gardenId);
  }
}
