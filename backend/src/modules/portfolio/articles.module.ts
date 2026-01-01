import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { PrismaArticleRepository } from './infrastructure/repositories/prisma-article.repository'; 

import { ArticlesService } from './application/articles.service';
import { ArticlesController } from './interface/articles.controller';

@Module({
  controllers: [ArticlesController],
  providers: [
    PrismaService,
    ArticlesService, 
    {
      provide: 'ArticleRepository',
      useClass: PrismaArticleRepository,
    },
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}