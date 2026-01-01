import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticlesService } from '../application/articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() data: any) {
    return this.articlesService.create(data);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findOne(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.articlesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}