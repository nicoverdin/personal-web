'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Playfair_Display, Inter } from 'next/font/google';

// Configuramos las fuentes igual que en el Home
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });

export default function Navbar() {
  const pathname = usePathname();

  // Función para determinar si el enlace está activo
  // Ahora usa una línea inferior sutil en lugar de volverse azul
  const linkStyles = (path: string) => `
    relative text-sm uppercase tracking-widest transition-colors duration-300
    ${pathname === path ? 'text-[#1a1a1a] font-medium' : 'text-gray-500 hover:text-[#1a1a1a]'}
    after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[1px] after:bg-[#1a1a1a] after:transition-all after:duration-300
    ${pathname === path ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
  `;

  return (
    // Fondo #f4f3f0 con transparencia y blur para efecto "vidrio esmerilado"
    <nav className={`bg-[#f4f3f0]/90 backdrop-blur-sm border-b border-[#1a1a1a]/5 sticky top-0 z-50 ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO: Estilo Editorial */}
          <div className="flex-shrink-0">
            <Link href="/" className={`${playfair.className} text-xl md:text-2xl font-bold text-[#1a1a1a] tracking-tight hover:opacity-70 transition-opacity`}>
              N.V.
            </Link>
          </div>

          {/* ENLACES: Estilo Museo (Mayúsculas, espaciados) */}
          <div className="hidden md:flex space-x-12">
            <Link href="/" className={linkStyles('/')}>Home</Link>
            <Link href="/projects" className={linkStyles('/projects')}>Exhibition</Link>
            <Link href="/blog" className={linkStyles('/blog')}>Manifesto</Link>
          </div>

          {/* BOTÓN ADMIN: Minimalista */}
          <div>
            <Link 
              href="/admin" 
              className="text-xs font-mono border border-gray-300 rounded-full px-4 py-2 text-gray-500 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-300"
            >
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}