'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  isVisible: boolean;
  createdAt: string;
  tags?: any[];
};

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/articles`);
        
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const published = data.filter((a: Article) => a.isVisible === true);
            setArticles(published);
          }
        }
      } catch (error) {
        console.error("Error cargando el blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500 text-xl">Cargando pensamientos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            El Blog
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Pensamientos, tutoriales y cosas de código.
          </p>
        </div>

        <div className="space-y-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      <Link href={`/blog/${article.slug}`} className="hover:text-blue-600 transition-colors">
                        {article.title}
                      </Link>
                    </h2>
                    <span className="text-sm text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Link 
                      href={`/blog/${article.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-800"
                    >
                      Leer más →
                    </Link>
                    
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex gap-2">
                            {article.tags.map((tag: any, index: number) => (
                                <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    #{typeof tag === 'string' ? tag : tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow p-8">
              <p className="text-gray-500 text-lg mb-2">No hay artículos públicos todavía.</p>
              <p className="text-sm text-gray-400">
                (Ve al Admin y asegúrate de marcar la casilla "Publicar")
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}