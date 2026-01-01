'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

// Configuración de fuentes
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400'] });

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
            // Ordenar por fecha (más reciente primero)
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
      
      {/* 🎨 TEXTURA DE FONDO */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 lg:py-28">
        
        {/* CABECERA */}
        <div className="mb-20">
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black tracking-tight mb-6`}>
            Manifesto
          </h1>
          <p className="max-w-xl text-lg text-gray-600 font-light leading-relaxed border-l border-gray-400 pl-6 ml-2">
            A collection of thoughts, technical breakdowns, and explorations into the digital ether.
          </p>
        </div>

        {/* LISTA DE ARTÍCULOS (Estilo Editorial) */}
        <div className="flex flex-col">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article 
                key={article.id} 
                className="group border-t border-[#1a1a1a]/10 py-12 transition-all hover:bg-white/40"
              >
                <Link href={`/blog/${article.slug}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                    
                    {/* FECHA (Estilo Código) */}
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-widest min-w-[120px]">
                      {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>

                    {/* TÍTULO */}
                    <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold flex-grow group-hover:italic transition-all duration-300`}>
                      {article.title}
                    </h2>

                    {/* FLECHA DECORATIVA (Solo visible en Desktop al hover) */}
                    <span className="hidden md:block opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      →
                    </span>
                  </div>

                  {/* TAGS */}
                  <div className="md:pl-[120px] flex gap-3 mt-2">
                     {article.tags && article.tags.length > 0 && article.tags.map((tag: any, index: number) => (
                        <span key={index} className="text-[10px] font-mono uppercase tracking-wider border border-gray-300 rounded-full px-3 py-1 text-gray-500 group-hover:border-[#1a1a1a] group-hover:text-[#1a1a1a] transition-colors">
                            {typeof tag === 'string' ? tag : tag.name}
                        </span>
                     ))}
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
          
          {/* Línea final de cierre */}
          <div className="border-t border-[#1a1a1a]/10 w-full" />
        </div>
      </div>
    </div>
  );
}