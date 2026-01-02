'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400'] });

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
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
            published.sort((a: Article, b: Article) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setArticles(published);
          }
        }
      } catch (error) {
        console.error("Error loading blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#f4f3f0] flex justify-center items-center ${inter.className}`}>
        <p className="text-[#1a1a1a] font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Scanning Archive...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-28">
        
        <div className="mb-12 md:mb-20">
          <h1 className={`${playfair.className} text-5xl md:text-8xl font-black tracking-tight mb-4 md:mb-6`}>
            Manifesto
          </h1>
          <p className="max-w-xl text-base md:text-lg text-gray-500 font-light leading-relaxed border-l border-gray-300 pl-5 ml-1">
            Technical breakdowns and explorations into the digital ether.
          </p>
        </div>

        <div className="flex flex-col">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article 
                key={article.id} 
                className="group border-t border-[#1a1a1a]/10 py-10 md:py-12 transition-all md:hover:bg-white/40 px-1 md:px-4"
              >
                <Link href={`/blog/${article.slug}`} className="block">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                    
                    {article.coverImage && (
                      <div className="relative w-full md:w-64 aspect-video md:h-44 overflow-hidden border border-[#1a1a1a]/5 bg-white shrink-0">
                        <Image 
                          src={article.coverImage} 
                          alt={article.title} 
                          fill 
                          className="object-cover transition-all duration-1000 md:filter md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 256px"
                        />
                      </div>
                    )}

                    <div className="flex flex-col justify-center grow">
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-4">
                        <h2 className={`${playfair.className} text-2xl md:text-4xl font-bold md:group-hover:italic transition-all duration-300 leading-tight`}>
                          {article.title}
                        </h2>
                        <span className="font-mono text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.2em] md:order-last">
                          {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {article.excerpt && (
                        <p className="text-sm md:text-[15px] text-gray-500 font-light leading-relaxed mb-6 line-clamp-3 md:line-clamp-2 max-w-2xl">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 items-center">
                         {article.tags && article.tags.length > 0 && article.tags.map((tag: any, index: number) => (
                            <span key={index} className="text-[8px] md:text-[9px] font-mono uppercase tracking-widest border border-gray-200 rounded-full px-2.5 py-1 text-gray-400">
                                #{typeof tag === 'string' ? tag : tag.name}
                            </span>
                         ))}
                         <span className="ml-auto hidden md:block opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-xl">
                            →
                         </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="py-32 text-center border-y border-[#1a1a1a]/10">
              <p className={`${playfair.className} text-xl md:text-2xl text-gray-400 italic`}>
                "The records are currently blank."
              </p>
            </div>
          )}
          
          <div className="border-t border-[#1a1a1a]/10 w-full" />
        </div>
      </div>
    </div>
  );
}