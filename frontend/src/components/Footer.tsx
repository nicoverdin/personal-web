'use client';

import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400'] });

export default function Footer() {
  return (
    <footer className={`bg-[#f4f3f0] border-t border-[#1a1a1a]/5 py-12 md:py-16 mt-auto ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-10 md:gap-8">
        
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <p className={`${playfair.className} text-2xl md:text-xl font-bold text-[#1a1a1a] tracking-tight`}>
            Nicolás Verdín Domínguez
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-[0.2em]">
              Full Stack Software Engineer
            </p>
            <p className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest">
              © {new Date().getFullYear()} — Portfolio v1.0
            </p>
          </div>
        </div>

        <div className="flex gap-6 md:gap-8 border-t md:border-t-0 border-[#1a1a1a]/5 pt-8 md:pt-0 w-full md:w-auto justify-center">
          <FooterLink href="https://github.com/nicoverdin" label="GitHub" />
          <FooterLink href="https://linkedin.com/in/nicolasverdin" label="LinkedIn" />
          <FooterLink href="mailto:nverdind@gmail.com" label="Email" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 text-center md:text-left">
        <p className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] opacity-50">
          Architecture: Next.js + NestJS + Prisma + Coolify
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-xs md:text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors relative group py-2"
    >
      {label}
      <span className="absolute bottom-1 left-0 w-0 h-px bg-[#1a1a1a] transition-all duration-300 group-hover:w-full"></span>
    </a>
  );
}