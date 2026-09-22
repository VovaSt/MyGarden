import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class HarvestCalendarQueryDto {
  @IsUUID()
  gardenId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @IsUUID()
  speciesId?: string;

  @IsOptional()
  @IsUUID()
  treeId?: string;

  @IsOptional()
  @IsUUID()
  varietyId?: string;
}
