import { IsDateString, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateVarietySourceDto {
  @IsString()
  @Length(1, 180)
  sourceName!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  sourceUrl?: string;

  @IsOptional()
  @IsDateString()
  retrievedAt?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10_000)
  notes?: string;
}
