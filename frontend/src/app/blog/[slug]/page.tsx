'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display, Inter } from 'next/font/google';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8 md:my-12 shadow-sm border border-gray-100 overflow-hidden">
      <div className="absolute left-4 top-3 md:left-0 md:-top-6 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 z-20">
        {language || 'code'}
      </div>
      
      <button 
        onClick={copyToClipboard}
        className="absolute right-4 top-3 md:top-4 z-20 px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-mono uppercase tracking-widest bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-400 active:text-[#1a1a1a] md:hover:text-[#1a1a1a] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      <div className="overflow-x-auto">
        <SyntaxHighlighter 
          language={language} 
          style={oneLight} 
          customStyle={{
            padding: '2.5rem 1rem 1.5rem 1rem',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            backgroundColor: '#fdfdfc',
            margin: 0,
            minWidth: '100%',
          }}
          codeTagProps={{
            style: { fontSize: 'inherit', lineHeight: 'inherit' }
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default function ArticlePage({ params }: { params: any }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const resolvedParams = await params;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      try {
        const res = await fetch(`${apiUrl}/articles/${resolvedParams.slug}`);
        if (res.ok) setArticle(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [params]);

  if (loading) return (
    <div className="min-h-screen bg-[#f4f3f0] flex items-center justify-center font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">
      Retrieving record...
    </div>
  );

  if (!article) return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-[#f4f3f0] text-[#1a1a1a] px-6 text-center ${inter.className}`}>
      <h1 className={`${playfair.className} text-6xl font-bold mb-4`}>404</h1>
      <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-8">Manifesto entry not found</p>
      <Link href="/blog" className="border-b border-black pb-1 hover:opacity-50 transition-opacity text-sm">← Return to Index</Link>
    </div>
  );

  return (
    <div className={`min-h-screen relative bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <article className="relative z-10 max-w-3xl mx-auto py-12 md:py-20 px-5 md:px-6">
        <div className="mb-10 md:mb-12">
          <Link href="/blog" className="inline-block text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-[#1a1a1a] transition-colors group py-2">
            <span className="inline-block transition-transform group-hover:-translate-x-1 mr-2">←</span>
            Back to Index
          </Link>
        </div>

        <header className="mb-10 md:mb-12 border-b border-[#1a1a1a]/10 pb-10 md:pb-12 text-left">
          <div className="flex flex-wrap gap-3 items-center mb-6 md:mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 border border-gray-200 rounded-full px-3 py-1">
              {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {article.tags && article.tags.map((tag: any, idx: number) => (
               <span key={idx} className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  #{typeof tag === 'string' ? tag : tag.name}
               </span>
            ))}
          </div>

          <h1 className={`${playfair.className} text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-[#1a1a1a] mb-6 md:mb-8`}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed italic border-l-2 border-gray-200 pl-5 md:pl-6">
              {article.excerpt}
            </p>
          )}
        </header>

        {article.coverImage && (
          <div className="relative w-full aspect-video md:h-112.5 mb-12 md:mb-16 overflow-hidden border border-[#1a1a1a]/5 bg-white shadow-sm">
            <Image 
              src={article.coverImage} 
              alt={article.title} 
              fill 
              className="object-cover transition-all duration-1000 filter grayscale group-hover:grayscale-0"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        <div className={`
            prose prose-md md:prose-lg max-w-none 
            prose-headings:font-serif prose-headings:${playfair.className} prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-gray-700 prose-p:font-light prose-p:leading-relaxed
            prose-a:text-[#1a1a1a] prose-a:underline prose-a:underline-offset-4 prose-a:decoration-1 hover:prose-a:decoration-2
            prose-blockquote:border-l-[#1a1a1a] prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-gray-600
            prose-img:rounded-sm prose-img:shadow-md
            prose-li:text-gray-700
            prose-code:text-[#1a1a1a] prose-code:bg-gray-200/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-[0.85em]
            prose-code:before:content-none prose-code:after:content-none
        `}>
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock 
                    language={match[1]} 
                    value={String(children).replace(/\n$/, '')} 
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-16 md:mt-20 pt-10 md:pt-12 border-t border-[#1a1a1a]/10 flex justify-between items-center">
            <p className={`${playfair.className} italic text-gray-400 text-sm`}>End of record.</p>
            <Link href="/blog" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:underline">
              Browse Manifesto →
            </Link>
        </footer>
      </article>
    </div>
  );
}