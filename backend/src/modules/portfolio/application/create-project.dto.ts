import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsUrl()
  @IsOptional()
  repoUrl?: string;
}