'use client';

import { Playfair_Display, Inter } from 'next/font/google';

// Configuración de fuentes
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400'] });

export default function Footer() {
  return (
    <footer className={`bg-[#f4f3f0] border-t border-[#1a1a1a]/5 py-12 mt-auto ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-end gap-8">
        
        {/* IZQUIERDA: Créditos Técnicos */}
        <div className="flex flex-col gap-2">
          <p className={`${playfair.className} text-xl font-bold text-[#1a1a1a]`}>
            Nicolás Verdín Domínguez
          </p>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            © {new Date().getFullYear()} — Built with Next.js 15 & NestJS
          </p>
        </div>

        {/* DERECHA: Enlaces Sociales (Estilo Texto) */}
        <div className="flex gap-8">
          <FooterLink href="https://github.com/nicoverdin" label="GitHub" />
          <FooterLink href="https://linkedin.com/in/nicolasverdin" label="LinkedIn" />
          <FooterLink href="mailto:nverdind@gmail.com" label="Email" />
        </div>
      </div>
    </footer>
  );
}

// Componente auxiliar para los enlaces del footer
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors relative group"
    >
      {label}
      {/* Pequeña línea que aparece al hacer hover */}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#1a1a1a] transition-all duration-300 group-hover:w-full"></span>
    </a>
  );
}