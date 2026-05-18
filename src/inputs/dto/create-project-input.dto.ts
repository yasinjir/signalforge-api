import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectInputDto {
  @IsString()
  @IsOptional()
  inputType?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  contentText: string;

  @IsString()
  @IsOptional()
  contentJson?: string;
}