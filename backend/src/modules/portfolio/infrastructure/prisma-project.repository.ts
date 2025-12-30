import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../domain/project.repository';
import { Project } from '../domain/project.entity';
import { ProjectMapper } from './project.mapper';
import { Project as PrismaProject } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(project: Project): Promise<Project> {
    const saved = await this.prisma.project.create({
      data: {
        id: project.id,
        title: project.title,
        description: project.description,
        url: project.url,
        image: project.image,
        repoUrl: project.repoUrl,
      },
    });
    return ProjectMapper.toDomain(saved);
  }

  async findAll(): Promise<Project[]> {
    const rawProjects = await this.prisma.project.findMany();
    return rawProjects.map((raw: PrismaProject) => ProjectMapper.toDomain(raw));
  }

  async findById(id: string): Promise<Project | null> {
    const raw = await this.prisma.project.findUnique({ where: { id } });
    if (!raw) return null;
    return ProjectMapper.toDomain(raw);
  }
}