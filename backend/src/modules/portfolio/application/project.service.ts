import { Injectable, Inject } from '@nestjs/common';
import type { ProjectRepository } from '../domain/project.repository';
import { Project } from '../domain/project.entity';
import { CreateProjectDto } from './create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('ProjectRepository') private readonly projectRepo: ProjectRepository
  ) {}

  async createProject(dto: CreateProjectDto): Promise<Project> {
    const newProject = new Project(dto);

    return this.projectRepo.create(newProject);
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projectRepo.findAll();
  }

  async updateProject(id: string, data: any): Promise<Project> {
    return this.projectRepo.update(id, data);
  }

  async deleteProject(id: string): Promise<void> {
    return this.projectRepo.delete(id);
  }
}