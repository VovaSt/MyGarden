import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { MoveTreeDto } from './dto/move-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { TreesService } from './trees.service';

@Controller('trees')
export class TreesController {
  constructor(private readonly treesService: TreesService) {}

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.treesService.findOne(id);
  }

  @Patch(':id/position')
  move(@Param('id', new ParseUUIDPipe()) id: string, @Body() moveTreeDto: MoveTreeDto) {
    return this.treesService.move(id, moveTreeDto);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateTreeDto: UpdateTreeDto) {
    return this.treesService.update(id, updateTreeDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.treesService.remove(id);
  }
}
