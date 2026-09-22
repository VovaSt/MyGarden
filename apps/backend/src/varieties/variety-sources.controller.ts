import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateVarietySourceDto } from './dto/create-variety-source.dto';
import { VarietiesService } from './varieties.service';

@Controller()
export class VarietySourcesController {
  constructor(private readonly varietiesService: VarietiesService) {}

  @Get('varieties/:varietyId/sources')
  findAll(@Param('varietyId', new ParseUUIDPipe()) varietyId: string) {
    return this.varietiesService.findSources(varietyId);
  }

  @Post('varieties/:varietyId/sources')
  create(
    @Param('varietyId', new ParseUUIDPipe()) varietyId: string,
    @Body() createVarietySourceDto: CreateVarietySourceDto,
  ) {
    return this.varietiesService.createSource(varietyId, createVarietySourceDto);
  }

  @Delete('variety-sources/:sourceId')
  @HttpCode(204)
  async remove(@Param('sourceId', new ParseUUIDPipe()) sourceId: string): Promise<void> {
    await this.varietiesService.removeSource(sourceId);
  }
}
