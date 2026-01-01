import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Playfair_Display, Inter } from 'next/font/google';

// Configuración de fuentes
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

// Forzamos renderizado dinámico para recibir el ID fresco
export const dynamic = 'force-dynamic';

async function getProject(id: string) {
  // Priorizamos la URL interna de Docker si existe
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  console.log(`🔍 Intentando buscar proyecto: ${id}`);
  console.log(`🌐 URL usada: ${apiUrl}/projects/${id}`);

  try {
    const res = await fetch(`${apiUrl}/projects/${id}`, { cache: 'no-store' });
    
    if (!res.ok) {
      console.error(`❌ Error API: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error(`📄 Respuesta: ${text}`);
      return null;
    }

    const data = await res.json();
    console.log(`✅ Proyecto encontrado: ${data.title}`);
    return data;

  } catch (error) {
    console.error(`💀 Error de conexión (Fetch failed):`, error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetail({ params }: Props) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <div className={`min-h-screen relative bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
      
      {/* 🎨 TEXTURA DE FONDO */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        {/* NAVEGACIÓN: BACK */}
        <div className="mb-12">
            <Link href="/projects" className="group inline-flex items-center text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors">
                <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
                Back to Exhibition
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* COLUMNA IZQUIERDA: La Obra (Imagen) */}
            <div className="lg:col-span-7 w-full">
                <div className="relative aspect-video w-full overflow-hidden border border-[#1a1a1a]/10 shadow-2xl shadow-[#1a1a1a]/5 bg-gray-200">
                    {project.image ? (
                        <Image 
                            src={project.image} 
                            alt={project.title} 
                            fill 
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 60vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 font-mono text-xs tracking-widest uppercase">
                            [ NO VISUAL DATA ]
                        </div>
                    )}
                </div>
            </div>

            {/* COLUMNA DERECHA: Ficha Técnica */}
            <div className="lg:col-span-5 flex flex-col h-full sticky top-24">
                
                {/* ID Decorativo */}
                <div className="border-b border-[#1a1a1a] pb-6 mb-8">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                        Catalog No. {project.id.split('-')[0]}
                    </span>
                    <h1 className={`${playfair.className} text-5xl md:text-6xl font-black text-[#1a1a1a] mt-4 leading-tight`}>
                        {project.title}
                    </h1>
                </div>

                {/* Descripción */}
                <div className="prose prose-lg text-gray-600 font-light leading-relaxed mb-10">
                    <p>{project.description}</p>
                </div>

                {/* Botones de Acción / Enlaces */}
                <div className="mt-auto pt-8 border-t border-[#1a1a1a]/10">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4">
                        External Resources
                    </p>
                    <div className="flex flex-col gap-4">
                        {project.url && (
                            <a 
                                href={project.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group flex justify-between items-center w-full py-4 px-6 border border-[#1a1a1a]/20 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
                            >
                                <span className="text-sm font-bold uppercase tracking-widest">Live Demonstration</span>
                                <span className="group-hover:translate-x-1 transition-transform">↗</span>
                            </a>
                        )}
                        
                        {project.repoUrl && (
                            <a 
                                href={project.repoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group flex justify-between items-center w-full py-4 px-6 border border-[#1a1a1a]/20 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
                            >
                                <span className="text-sm font-bold uppercase tracking-widest">Source Code (GitHub)</span>
                                <span className="group-hover:translate-x-1 transition-transform">↗</span>
                            </a>
                        )}

                        {!project.url && !project.repoUrl && (
                            <div className="py-3 px-4 bg-gray-100 text-gray-400 text-xs font-mono text-center">
                                PRIVATE COLLECTION - NO LINKS AVAILABLE
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}