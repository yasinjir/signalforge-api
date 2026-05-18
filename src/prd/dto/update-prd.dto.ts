import { IsOptional, IsString } from 'class-validator';

export class UpdatePrdDto {
  @IsString()
  @IsOptional()
  problemStatement?: string;

  @IsString()
  @IsOptional()
  goalsText?: string;

  @IsString()
  @IsOptional()
  targetUsersText?: string;

  @IsString()
  @IsOptional()
  scopeText?: string;

  @IsString()
  @IsOptional()
  nonGoalsText?: string;

  @IsString()
  @IsOptional()
  successMetricsText?: string;

  @IsString()
  @IsOptional()
  risksText?: string;

  @IsString()
  @IsOptional()
  openQuestionsText?: string;
}