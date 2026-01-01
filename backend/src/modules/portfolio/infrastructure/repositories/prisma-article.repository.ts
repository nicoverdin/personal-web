import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ArticleRepository } from '../../domain/article.repository';
import { Article } from '../../domain/article.entity';

@Injectable()
export class PrismaArticleRepository implements ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(article: Article): Promise<Article> {
    const saved = await this.prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        content: article.content,
        isVisible: article.isVisible,
        excerpt: article.excerpt,
        coverImage: article.coverImage,
      },
    });
    return new Article(saved as any);
  }

  async findAll(): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return articles.map((a: any) => new Article(a as any));
  }

  async findOne(slug: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) return null;
    return new Article(article as any);
  }

  async update(id: string, data: any): Promise<Article> {
    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        isVisible: Boolean(data.isVisible),
        updatedAt: new Date(),
        excerpt: data.excerpt,
        coverImage: data.coverImage,
      },
    });

    return new Article(updated as any);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }
}