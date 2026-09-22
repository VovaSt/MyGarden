import { PartialType } from '@nestjs/mapped-types';
import { CreateGraftDto } from './create-graft.dto';

export class UpdateGraftDto extends PartialType(CreateGraftDto) {}
