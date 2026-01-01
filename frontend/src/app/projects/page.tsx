// frontend/src/app/projects/page.tsx
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Mis Proyectos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div key={project.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
               <div className="h-48 bg-gray-200 relative">
                  {project.url && <Image src={project.url} alt={project.title} fill className="object-cover" />}
               </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                {project.url && (
                  <a href={project.url} target="_blank" className="text-blue-600 hover:text-blue-800 font-medium">
                    Ver Proyecto →
                  </a>
                )}
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <p className="col-span-full text-center text-gray-500">No hay proyectos públicos aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}