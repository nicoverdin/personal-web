import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

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
      <div className={`min-h-screen flex flex-col items-center justify-center bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
        <h1 className={`${playfair.className} text-6xl font-bold mb-4`}>404</h1>
        <p className="text-gray-500 mb-8 font-mono text-sm uppercase tracking-widest">Article not found in archives</p>
        <Link href="/blog" className="border-b border-black pb-1 hover:opacity-50 transition-opacity">← Return to Manifesto</Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <article className="relative z-10 max-w-3xl mx-auto py-20 px-6">
        
        <div className="mb-12">
          <Link href="/blog" className="inline-block text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors group">
            <span className="inline-block transition-transform group-hover:-translate-x-1 mr-2">←</span>
            Back to Index
          </Link>
        </div>

        <header className="mb-12 border-b border-[#1a1a1a]/10 pb-12">
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400 border border-gray-300 rounded-full px-3 py-1">
              {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {article.tags && article.tags.map((tag: any, idx: number) => (
               <span key={idx} className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  #{typeof tag === 'string' ? tag : tag.name}
               </span>
            ))}
          </div>

          <h1 className={`${playfair.className} text-5xl md:text-6xl font-black leading-tight tracking-tight text-[#1a1a1a] mb-8`}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-500 font-light leading-relaxed italic border-l-2 border-gray-200 pl-6 mb-8">
              {article.excerpt}
            </p>
          )}
        </header>

        {article.coverImage && (
          <div className="relative w-full h-[400px] mb-16 overflow-hidden border border-[#1a1a1a]/10 group">
            <Image 
              src={article.coverImage} 
              alt={article.title} 
              fill 
              className="object-cover transition-all duration-1000 filter grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100"
              priority
            />
          </div>
        )}

        <div className={`
            prose prose-lg max-w-none 
            prose-headings:font-serif prose-headings:${playfair.className} prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-gray-700 prose-p:font-light prose-p:leading-relaxed
            prose-a:text-[#1a1a1a] prose-a:underline prose-a:underline-offset-4 prose-a:decoration-1 hover:prose-a:decoration-2
            prose-blockquote:border-l-[#1a1a1a] prose-blockquote:italic prose-blockquote:font-serif
            
            prose-code:text-[#1a1a1a] prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
            prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#1a1a1a] prose-pre:text-gray-100 prose-pre:rounded-md prose-pre:shadow-sm
            
            prose-img:rounded-sm prose-img:shadow-md
            
            prose-li:text-gray-700
        `}>
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        <div className="mt-20 pt-12 border-t border-[#1a1a1a]/10 flex justify-between items-center">
            <p className={`${playfair.className} italic text-gray-400`}>End of record.</p>
            <Link href="/blog" className="text-sm font-bold uppercase tracking-widest hover:underline">
              Browse More →
            </Link>
        </div>

      </article>
    </div>
  );
}