'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const linkStyles = (path: string) => `
    relative text-sm uppercase tracking-widest transition-colors duration-300
    ${pathname === path ? 'text-[#1a1a1a] font-medium' : 'text-gray-500 hover:text-[#1a1a1a]'}
    after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[1px] after:bg-[#1a1a1a] after:transition-all after:duration-300
    ${pathname === path ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
  `;

  return (
    <nav className={`bg-[#f4f3f0]/95 backdrop-blur-md border-b border-[#1a1a1a]/5 sticky top-0 z-60 ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <div className="shrink-0 z-70">
            <Link href="/" className={`${playfair.className} text-xl md:text-2xl font-bold text-[#1a1a1a] tracking-tight hover:opacity-70 transition-opacity`}>
              N.V.
            </Link>
          </div>

          <div className="hidden md:flex space-x-12">
            <Link href="/" className={linkStyles('/')}>Home</Link>
            <Link href="/projects" className={linkStyles('/projects')}>Exhibition</Link>
            <Link href="/blog" className={linkStyles('/blog')}>Manifesto</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="hidden sm:inline-block text-[10px] font-mono border border-gray-300 rounded-full px-4 py-1.5 text-gray-500 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-300"
            >
              ADMIN
            </Link>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden z-70 p-2 -mr-2 text-[#1a1a1a] focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between items-end">
                <span className={`h-px bg-black transition-all duration-300 ${isOpen ? 'w-6 translate-y-2 -rotate-45' : 'w-6'}`} />
                <span className={`h-px bg-black transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`} />
                <span className={`h-px bg-black transition-all duration-300 ${isOpen ? 'w-6 -translate-y-2 rotate-45' : 'w-5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className={`
        fixed inset-0 bg-[#f4f3f0] z-65 transform transition-transform duration-500 ease-in-out md:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col items-center justify-center h-full space-y-12">
          <nav className="flex flex-col items-center space-y-8">
            <Link href="/" onClick={() => setIsOpen(false)} className={`${playfair.className} text-4xl hover:italic`}>Home</Link>
            <Link href="/projects" onClick={() => setIsOpen(false)} className={`${playfair.className} text-4xl hover:italic`}>Exhibition</Link>
            <Link href="/blog" onClick={() => setIsOpen(false)} className={`${playfair.className} text-4xl hover:italic`}>Manifesto</Link>
          </nav>
          
          <div className="pt-8 border-t border-black/10 w-24 flex justify-center">
            <Link href="/admin" onClick={() => setIsOpen(false)} className="text-xs font-mono tracking-widest uppercase text-gray-400">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}