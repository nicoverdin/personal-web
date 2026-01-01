export class Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  isVisible: boolean;
  excerpt: string;
  coverImage: string;
  
  tags?: any[]; 

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Article>) {
    Object.assign(this, partial);
  }
}