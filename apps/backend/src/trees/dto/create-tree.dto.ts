import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';

export class CreateTreeDto {
  @IsUUID()
  speciesId!: string;

  @IsString()
  @Length(1, 120)
  label!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10_000)
  x!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10_000)
  y!: number;

  @IsOptional()
  @IsDateString()
  plantingDate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10_000)
  notes?: string;
}
