'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display, Inter } from 'next/font/google';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-12 shadow-sm border border-gray-100">
      <div className="absolute left-0 -top-6 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
        {language || 'code'}
      </div>
      
      <button 
        onClick={copyToClipboard}
        className="absolute right-4 top-4 z-20 px-3 py-1 text-[10px] font-mono uppercase tracking-widest bg-white border border-gray-200 text-gray-400 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      <SyntaxHighlighter 
        language={language} 
        style={oneLight} 
        customStyle={{
          padding: '2.5rem',
          fontSize: '0.9rem',
          lineHeight: '1.7',
          backgroundColor: '#fdfdfc',
          margin: 0,
        }}
      >
        {value}
      </SyntaxHighlighter>
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
    <div className="min-h-screen bg-[#f4f3f0] flex items-center justify-center font-mono text-xs tracking-widest uppercase">
      Loading entry...
    </div>
  );

  if (!article) return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
      <h1 className={`${playfair.className} text-6xl font-bold mb-4`}>404</h1>
      <Link href="/blog" className="border-b border-black pb-1 hover:opacity-50 transition-opacity">← Return to Manifesto</Link>
    </div>
  );

  return (
    <div className={`min-h-screen relative bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
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
          <div className="relative w-full h-112.5 mb-16 overflow-hidden border border-[#1a1a1a]/10 group">
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