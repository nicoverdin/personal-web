import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { PrismaProjectRepository } from './infrastructure/prisma-project.repository';
import { ProjectService } from './application/project.service';
import { ProjectController } from './interface/project.controller';

@Module({
  controllers: [ProjectController],
  providers: [
    PrismaService,
    ProjectService,
    {
      provide: 'ProjectRepository',
      useClass: PrismaProjectRepository,
    },
  ],
  exports: [ProjectService],
})
export class PortfolioModule {}