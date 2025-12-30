import { Project as PrismaProject } from '@prisma/client'; 
import { Project } from '../domain/project.entity';

export class ProjectMapper {
  static toDomain(raw: PrismaProject): Project {
    return new Project({
      id: raw.id,
      title: raw.title,
      description: raw.description,
      url: raw.url ?? undefined, 
      image: raw.image ?? undefined,
      repoUrl: raw.repoUrl ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}