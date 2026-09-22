import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateMapObjectDto } from './dto/create-map-object.dto';
import { UpdateMapObjectDto } from './dto/update-map-object.dto';
import { MapObjectsService } from './map-objects.service';

@Controller()
export class MapObjectsController {
  constructor(private readonly mapObjectsService: MapObjectsService) {}

  @Get('gardens/:gardenId/map-objects')
  findAll(@Param('gardenId', new ParseUUIDPipe()) gardenId: string) {
    return this.mapObjectsService.findAllByGarden(gardenId);
  }

  @Post('gardens/:gardenId/map-objects')
  create(@Param('gardenId', new ParseUUIDPipe()) gardenId: string, @Body() dto: CreateMapObjectDto) {
    return this.mapObjectsService.create(gardenId, dto);
  }

  @Patch('map-objects/:id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateMapObjectDto) {
    return this.mapObjectsService.update(id, dto);
  }

  @Delete('map-objects/:id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.mapObjectsService.remove(id);
  }
}
