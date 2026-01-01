import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../domain/project.repository';
import { Project } from '../../domain/project.entity';
import { ProjectMapper } from '../project.mapper';
import { Project as PrismaProject } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(project: Project): Promise<Project> {
    const saved = await this.prisma.project.create({
      data: {
        title: project.title,
        description: project.description,
        url: project.url || null,
        image: project.image || null,
        repoUrl: project.repoUrl || null,
      },
    });
    return new Project(saved as any);
  }

  async findAll(): Promise<Project[]> {
    const rawProjects = await this.prisma.project.findMany();
    return rawProjects.map((raw: PrismaProject) => ProjectMapper.toDomain(raw));
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    
    return project; 
  }

  async update(id: string, data: any): Promise<Project> {
    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        url: data.url || null,
        image: data.image || null,
        repoUrl: data.repoUrl || null,
        
        updatedAt: new Date(),
      },
    });
    return new Project(updated as any);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({
      where: { id },
    });
  }
}