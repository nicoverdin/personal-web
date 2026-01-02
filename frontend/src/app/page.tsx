import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '900'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400'] });

export default function HomePage() {
  return (
    <div className={`min-h-[calc(100vh-64px)] relative flex flex-col justify-center bg-[#f4f3f0] text-[#1a1a1a] overflow-hidden ${inter.className}`}>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#1a1a1a]/10 pointer-events-none z-10" />

      <main className="relative z-20 max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-8 flex flex-col justify-center">
          <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-4 border-l-2 border-red-600 pl-3">
            Full Stack Developer • AI • Security
          </p>
          
          <h1 className={`${playfair.className} text-5xl sm:text-7xl lg:text-8xl leading-[0.85] font-black tracking-tighter text-[#1a1a1a] mb-6`}>
            NICOLÁS<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] to-gray-400 italic font-medium pr-12">
              VERDÍN
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-lg font-light leading-relaxed">
            Crafting digital experiences where <b className="text-black font-medium">Cybersecurity</b> meets <b className="text-black font-medium">Artificial Intelligence</b>. 
            Building secure, scalable, and artistic web solutions.
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-10 lg:items-end lg:text-right border-t lg:border-t-0 lg:border-l border-gray-300 pt-8 lg:pt-0 lg:pl-12">
          
          <nav className="flex flex-col gap-4">
            <Link href="/projects" className="group">
              <span className={`${playfair.className} text-3xl hover:italic transition-all duration-300 border-b border-transparent group-hover:border-black`}>
                Exhibition (Projects)
              </span>
              <span className="block text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                View Gallery →
              </span>
            </Link>
            
            <Link href="/blog" className="group">
              <span className={`${playfair.className} text-3xl hover:italic transition-all duration-300 border-b border-transparent group-hover:border-black`}>
                Manifesto (Blog)
              </span>
              <span className="block text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Read Thoughts →
              </span>
            </Link>
          </nav>

          <div className="flex gap-6 mt-4">
             {/* GitHub */}
             <SocialLink href="https://github.com/nicoverdin">
               <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
               </svg>
             </SocialLink>

             {/* LinkedIn */}
             <SocialLink href="https://linkedin.com/in/nicolasverdin">
               <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
               </svg>
             </SocialLink>

             {/* X (Twitter) */}
             <SocialLink href="https://x.com/verdin3c">
               <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                 <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
               </svg>
             </SocialLink>
          </div>
        </div>
      </main>

    </div>
  );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-[#1a1a1a] hover:bg-black hover:text-white hover:border-black transition-all duration-300"
    >
      {children}
    </a>
  );
}