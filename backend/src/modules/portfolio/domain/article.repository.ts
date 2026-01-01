import { Article } from './article.entity';

export interface ArticleRepository {
  create(article: Article): Promise<Article>;
  findAll(): Promise<Article[]>;
  findOne(slug: string): Promise<Article | null>;

  update(id: string, data: Partial<Article>): Promise<Article>;
  delete(id: string): Promise<void>;
}