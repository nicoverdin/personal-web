import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    const { tags, ...articleData } = createArticleDto;

    return this.prisma.article.create({
      data: {
        ...articleData,
        tags: {
          connectOrCreate: tags?.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: { tags: true },
    });
  }

  findAll() {
    return this.prisma.article.findMany({
      where: { isVisible: true },
      include: { tags: true },
    });
  }

  findAllAdmin() {
    return this.prisma.article.findMany({
      include: { tags: true },
    });
  }

  async findOne(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: { tags: true },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    return article;
  }
}