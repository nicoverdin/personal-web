import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; 

async function getArticle(slug: string) {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${apiUrl}/articles/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const article = await getArticle(slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-8">Artículo "{slug}" no encontrado</p>
        <Link href="/blog" className="text-blue-600 hover:underline">← Volver al blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto prose prose-lg prose-blue">
        <div className="mb-8 border-b pb-8">
          <Link href="/blog" className="no-underline text-sm text-gray-500 hover:text-blue-600 mb-4 block">
            ← Volver
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{article.title}</h1>
        </div>
        <div className="text-gray-800 leading-relaxed">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}