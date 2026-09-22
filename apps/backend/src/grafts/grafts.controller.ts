import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateGraftDto } from './dto/create-graft.dto';
import { UpdateGraftDto } from './dto/update-graft.dto';
import { GraftsService } from './grafts.service';

@Controller()
export class GraftsController {
  constructor(private readonly graftsService: GraftsService) {}

  @Get('trees/:treeId/grafts')
  findAll(@Param('treeId', new ParseUUIDPipe()) treeId: string) {
    return this.graftsService.findAllByTree(treeId);
  }

  @Post('trees/:treeId/grafts')
  create(@Param('treeId', new ParseUUIDPipe()) treeId: string, @Body() createGraftDto: CreateGraftDto) {
    return this.graftsService.create(treeId, createGraftDto);
  }

  @Patch('grafts/:id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateGraftDto: UpdateGraftDto) {
    return this.graftsService.update(id, updateGraftDto);
  }

  @Delete('grafts/:id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.graftsService.remove(id);
  }
}
