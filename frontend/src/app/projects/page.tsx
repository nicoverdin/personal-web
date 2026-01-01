import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display, Inter } from 'next/font/google';

// Configuración de fuentes
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

type Project = {
  id: string;
  title: string;
  description: string;
  url?: string | null;
  image?: string | null;
  repoUrl?: string | null;
};

async function getProjects() {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/projects`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className={`min-h-screen relative bg-[#f4f3f0] text-[#1a1a1a] ${inter.className}`}>
      
      {/* 🎨 TEXTURA DE FONDO */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28">
        
        {/* CABECERA DE LA EXPOSICIÓN */}
        <div className="border-b border-[#1a1a1a]/10 pb-12 mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">
            Curated Collection 01
          </p>
          <h1 className={`${playfair.className} text-5xl md:text-7xl font-bold tracking-tight mb-6`}>
            Selected Works
          </h1>
          <p className="max-w-xl text-lg text-gray-600 font-light leading-relaxed">
             A showcase of technical craftsmanship, exploring the intersection of design, security, and performance.
          </p>
        </div>
        
        {/* GALERÍA (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {projects.map((project: Project) => (
            // ✨ AQUÍ ESTÁ EL CAMBIO: Envolvemos todo en Link
            <Link key={project.id} href={`/projects/${project.id}`} className="group block h-full">
                <article className="flex flex-col h-full cursor-pointer">
                
                {/* 🖼️ MARCO DE LA IMAGEN */}
                <div className="relative h-64 w-full overflow-hidden border border-[#1a1a1a]/10 bg-gray-100 mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gray-200">
                    {project.image ? (
                        <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-all duration-700 filter grayscale group-hover:grayscale-0 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized // Mantenemos esto por si acaso Cloudinary sigue rebelde
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 font-mono text-xs tracking-widest uppercase">
                        [ Image Not Available ]
                        </div>
                    )}
                </div>

                {/* FICHA TÉCNICA */}
                <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-baseline mb-3">
                    <h2 className={`${playfair.className} text-2xl font-bold group-hover:underline decoration-1 underline-offset-4 transition-all`}>
                        {project.title}
                    </h2>
                    <span className="text-xs font-mono text-gray-400">REF-{project.id.substring(0,4).toUpperCase()}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3 font-light flex-grow">
                    {project.description}
                    </p>
                    
                    {/* 👇 CAMBIO: Quitamos botones y ponemos indicación de ver más */}
                    <div className="pt-4 border-t border-dashed border-gray-300 mt-auto">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] group-hover:opacity-70 transition-opacity">
                            View Details →
                        </span>
                    </div>
                </div>
                </article>
            </Link>
          ))}
          
          {/* Mensaje vacío */}
          {projects.length === 0 && (
            <div className="col-span-full py-24 text-center border-y border-[#1a1a1a]/5">
              <p className={`${playfair.className} text-2xl text-gray-400 italic`}>
                "The collection is currently being curated."
              </p>
              <p className="text-xs font-mono text-gray-300 mt-2 uppercase tracking-widest">
                Check back soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}