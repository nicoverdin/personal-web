'use client';

import Link from 'next/link';
import Image from 'next/image'; // Importado para las portadas
import { useEffect, useState } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400'] });

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;      // Nuevo campo
  coverImage?: string;   // Nuevo campo
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
        <p className="text-[#1a1a1a] font-mono text-sm tracking-widest uppercase animate-pulse">Loading Archive...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 lg:py-28">
        
        <div className="mb-20">
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black tracking-tight mb-6`}>
            Manifesto
          </h1>
          <p className="max-w-xl text-lg text-gray-600 font-light leading-relaxed border-l border-gray-400 pl-6 ml-2">
            A collection of thoughts, technical breakdowns, and explorations into the digital ether.
          </p>
        </div>

        <div className="flex flex-col">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article 
                key={article.id} 
                className="group border-t border-[#1a1a1a]/10 py-12 transition-all hover:bg-white/40 px-4"
              >
                <Link href={`/blog/${article.slug}`} className="block">
                  <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    
                    {/* 🖼️ MINIATURA DE PORTADA (Si existe) */}
                    {article.coverImage && (
                      <div className="relative w-full md:w-64 h-44 overflow-hidden border border-[#1a1a1a]/5 bg-gray-100 shrink-0">
                        <Image 
                          src={article.coverImage} 
                          alt={article.title} 
                          fill 
                          className="object-cover transition-all duration-700 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                        />
                      </div>
                    )}

                    <div className="flex flex-col justify-center flex-grow">
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-4">
                        <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold group-hover:italic transition-all duration-300`}>
                          {article.title}
                        </h2>
                        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                          {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {/* ✍️ EXTRACTO (Si existe) */}
                      {article.excerpt && (
                        <p className="text-sm text-gray-500 font-light leading-relaxed mb-6 line-clamp-2 max-w-2xl">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 items-center">
                         {article.tags && article.tags.length > 0 && article.tags.map((tag: any, index: number) => (
                            <span key={index} className="text-[9px] font-mono uppercase tracking-widest border border-gray-200 rounded-full px-3 py-1 text-gray-400 group-hover:border-[#1a1a1a]/20 group-hover:text-[#1a1a1a] transition-colors">
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
            <div className="py-24 text-center border-y border-[#1a1a1a]/10">
              <p className={`${playfair.className} text-2xl text-gray-400 italic`}>
                "The pages are currently blank."
              </p>
            </div>
          )}
          
          <div className="border-t border-[#1a1a1a]/10 w-full" />
        </div>
      </div>
    </div>
  );
}