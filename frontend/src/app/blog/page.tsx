import Link from 'next/link';

type Article = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  tags: { name: string }[];
};

async function getArticles(): Promise<Article[]> {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${apiUrl}/articles`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Blog Personal
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Pensamientos, tutoriales y aprendizajes.
          </p>
        </div>

        <div className="grid gap-8">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={`/blog/${article.slug}`}
              className="block group"
            >
              <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  <span className="text-sm text-gray-400">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Tags */}
                <div className="mt-4 flex gap-2">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}

          {articles.length === 0 && (
            <p className="text-center text-gray-500">No hay artículos publicados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}