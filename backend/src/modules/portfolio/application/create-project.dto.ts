import { IsString, IsNotEmpty, IsUrl, IsOptional, ValidateIf } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @ValidateIf((o) => o.url !== "" && o.url !== null)
  @IsUrl({}, { message: 'url must be a URL address' })
  url?: string;

  @IsOptional()
  @ValidateIf((o) => o.image !== "" && o.image !== null)
  @IsUrl({}, { message: 'image must be a URL address' })
  image?: string;

  @IsOptional()
  @ValidateIf((o) => o.repoUrl !== "" && o.repoUrl !== null)
  @IsUrl({}, { message: 'repoUrl must be a URL address' })
  repoUrl?: string;
}