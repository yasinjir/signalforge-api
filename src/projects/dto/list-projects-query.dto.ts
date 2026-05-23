import { IsOptional, IsString } from 'class-validator';

export class ListProjectsQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  includeArchived?: string;
}
