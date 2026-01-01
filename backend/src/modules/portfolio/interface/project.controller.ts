import { Controller, Get, Post, Body, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from '../application/project.service';
import { CreateProjectDto } from '../application/create-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get()
  async findAll() {
    return this.projectService.getAllProjects();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.projectService.updateProject(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}