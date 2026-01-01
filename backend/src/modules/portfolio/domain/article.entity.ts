export class Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  isVisible: boolean;
  
  tags?: any[]; 

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Article>) {
    Object.assign(this, partial);
  }
}