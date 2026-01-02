import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const dynamic = 'force-dynamic';

async function getProject(id: string) {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${apiUrl}/projects/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error de conexión:`, error);
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
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20">
        
        <div className="mb-8 md:mb-12">
            <Link href="/projects" className="group inline-flex items-center text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-gray-500 hover:text-[#1a1a1a] transition-colors py-2">
                <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
                Back to Exhibition
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start">
            
            <div className="lg:hidden mb-4">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block mb-2">
                    Catalog No. {project.id.split('-')[0]}
                </span>
                <h1 className={`${playfair.className} text-4xl font-black text-[#1a1a1a] leading-tight`}>
                    {project.title}
                </h1>
            </div>

            <div className="lg:col-span-7 w-full">
                <div className="relative aspect-video md:aspect-16/10 w-full overflow-hidden border border-[#1a1a1a]/5 shadow-xl md:shadow-2xl shadow-[#1a1a1a]/5 bg-white">
                    {project.image ? (
                        <Image 
                            src={project.image} 
                            alt={project.title} 
                            fill 
                            className="object-cover"
                            priority
                            sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 font-mono text-[10px] tracking-widest uppercase">
                            [ NO VISUAL DATA ]
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-5 flex flex-col h-full lg:sticky lg:top-24">
                
                <div className="hidden lg:block border-b border-[#1a1a1a] pb-6 mb-8">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                        Catalog No. {project.id.split('-')[0]}
                    </span>
                    <h1 className={`${playfair.className} text-6xl font-black text-[#1a1a1a] mt-4 leading-tight`}>
                        {project.title}
                    </h1>
                </div>

                <div className="prose prose-md md:prose-lg text-gray-600 font-light leading-relaxed mb-10 px-1 md:px-0">
                    <p className="whitespace-pre-line">{project.description}</p>
                </div>

                <div className="mt-auto pt-8 border-t border-[#1a1a1a]/10">
                    <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 text-center md:text-left">
                        External Resources
                    </p>
                    <div className="flex flex-col gap-3 md:gap-4">
                        {project.url && (
                            <a 
                                href={project.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group flex justify-between items-center w-full py-5 px-6 border border-[#1a1a1a]/10 bg-white md:bg-transparent md:border-[#1a1a1a]/20 active:bg-[#1a1a1a] active:text-white md:hover:bg-[#1a1a1a] md:hover:text-white transition-all duration-300"
                            >
                                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Live Demonstration</span>
                            </a>
                        )}
                        
                        {project.repoUrl && (
                            <a 
                                href={project.repoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group flex justify-between items-center w-full py-5 px-6 border border-[#1a1a1a]/10 bg-white md:bg-transparent md:border-[#1a1a1a]/20 active:bg-[#1a1a1a] active:text-white md:hover:bg-[#1a1a1a] md:hover:text-white transition-all duration-300"
                            >
                                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Source Code (GitHub)</span>
                            </a>
                        )}

                        {!project.url && !project.repoUrl && (
                            <div className="py-4 px-4 bg-gray-100/50 text-gray-400 text-[10px] font-mono text-center tracking-widest border border-dashed border-gray-200">
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