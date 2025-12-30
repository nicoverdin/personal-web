import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProjectService } from '../application/project.service';
import { CreateProjectDto } from '../application/create-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get()
  async findAll() {
    return this.projectService.getAllProjects();
  }
}