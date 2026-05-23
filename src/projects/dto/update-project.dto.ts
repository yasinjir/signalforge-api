import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  initiative?: string;

  @IsString()
  @IsOptional()
  backgroundContext?: string;

  @IsString()
  @IsOptional()
  analysisGoal?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
