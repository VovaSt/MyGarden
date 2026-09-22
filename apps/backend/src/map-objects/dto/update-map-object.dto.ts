import { PartialType } from '@nestjs/mapped-types';
import { CreateMapObjectDto } from './create-map-object.dto';

export class UpdateMapObjectDto extends PartialType(CreateMapObjectDto) {}
