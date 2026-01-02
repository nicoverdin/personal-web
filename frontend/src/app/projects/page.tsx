import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display, Inter } from 'next/font/google';

export const dynamic = 'force-dynamic'

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

const truncateDescription = (text: string, limit: number = 140) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trim() + "...";
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
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 lg:py-28">
        
        <div className="border-b border-[#1a1a1a]/10 pb-10 md:pb-12 mb-12 md:mb-16">
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-gray-400 mb-3 md:mb-4">
            Curated Collection
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-7xl font-bold tracking-tight mb-4 md:mb-6`}>
            Selected Works
          </h1>
          <p className="max-w-xl text-base md:text-lg text-gray-600 font-light leading-relaxed">
             A showcase of technical craftsmanship, exploring the intersection of design, security, and performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 md:gap-y-16">
          {projects.map((project: Project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                <article className="flex flex-col h-full cursor-pointer">
                
                <div className="relative aspect-4/3 md:h-64 w-full overflow-hidden border border-[#1a1a1a]/5 bg-white mb-5 transition-all duration-500 md:group-hover:shadow-2xl md:group-hover:shadow-gray-200">
                    {project.image ? (
                        <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-all duration-1000 md:filter md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized 
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 font-mono text-[10px] tracking-widest uppercase">
                        [ No Visual Record ]
                        </div>
                    )}
                    
                    <div className="absolute top-4 right-4 md:hidden bg-white/90 backdrop-blur-sm px-2 py-1 text-[9px] font-mono tracking-tighter border border-black/5">
                        REF-{project.id.substring(0,4).toUpperCase()}
                    </div>
                </div>

                <div className="flex flex-col px-1 md:px-0">
                    <div className="flex justify-between items-baseline mb-2 md:mb-3">
                    <h2 className={`${playfair.className} text-2xl font-bold md:group-hover:underline decoration-1 underline-offset-4 transition-all`}>
                        {project.title}
                    </h2>
                    <span className="hidden md:inline-block text-[10px] font-mono text-gray-400 shrink-0 ml-2">
                      REF-{project.id.substring(0,4).toUpperCase()}
                    </span>
                    </div>
                    
                    <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed mb-6 font-light line-clamp-3 md:line-clamp-2">
                      {truncateDescription(project.description, 150)}
                    </p>
                    
                    <div className="pt-4 border-t border-[#1a1a1a]/10 mt-auto flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                            Explore Project →
                        </span>
                    </div>
                </div>
                </article>
            </Link>
          ))}
          
          {/* EMPTY STATE */}
          {projects.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <p className={`${playfair.className} text-2xl text-gray-300 italic mb-4`}>
                "The gallery is currently being curated."
              </p>
              <div className="w-12 h-px bg-gray-200 mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}