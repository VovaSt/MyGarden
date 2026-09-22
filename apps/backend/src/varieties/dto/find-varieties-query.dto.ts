import { IsOptional, IsUUID } from 'class-validator';

export class FindVarietiesQueryDto {
  @IsOptional()
  @IsUUID()
  speciesId?: string;
}
