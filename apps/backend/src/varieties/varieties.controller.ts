import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateVarietyDto } from './dto/create-variety.dto';
import { FindVarietiesQueryDto } from './dto/find-varieties-query.dto';
import { UpdateVarietyDto } from './dto/update-variety.dto';
import { VarietiesService } from './varieties.service';

@Controller('varieties')
export class VarietiesController {
  constructor(private readonly varietiesService: VarietiesService) {}

  @Post()
  create(@Body() createVarietyDto: CreateVarietyDto) {
    return this.varietiesService.create(createVarietyDto);
  }

  @Get()
  findAll(@Query() query: FindVarietiesQueryDto) {
    return this.varietiesService.findAll(query.speciesId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.varietiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateVarietyDto: UpdateVarietyDto) {
    return this.varietiesService.update(id, updateVarietyDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.varietiesService.remove(id);
  }
}
