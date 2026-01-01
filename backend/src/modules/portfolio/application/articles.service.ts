import { Injectable, Inject } from '@nestjs/common';
import type { ArticleRepository } from '../domain/article.repository';
import { Article } from '../domain/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('ArticleRepository') private readonly articleRepo: ArticleRepository
  ) {}

  async create(data: any) {
    const newArticle = new Article(data as any);
    return this.articleRepo.create(newArticle);
  }

  async findAll() {
    return this.articleRepo.findAll();
  }

  async findOne(slug: string) {
    return this.articleRepo.findOne(slug);
  }

  async update(id: string, data: any) {
    return this.articleRepo.update(id, data);
  }

  async remove(id: string) {
    return this.articleRepo.delete(id);
  }
}