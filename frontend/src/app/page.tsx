import { Project } from '@/types/project';

async function getProjects(): Promise<Project[]> {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    console.log(`Fetching projects from: ${apiUrl}`);
    const res = await fetch(`${apiUrl}/projects`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Error al conectar con el backend');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-24">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Mi Portafolio
          </h1>
          <p className="text-xl text-gray-600">
            Desarrollado con NestJS (Backend) y Next.js (Frontend)
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow">
            <p className="text-red-500">
              No se han encontrado proyectos. ¿Está el backend encendido?
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <article
                key={project.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {project.title}
                  </h2>
                  {/* Etiqueta de 'Nuevo' si se creó hoy (Opcional, detalle visual) */}
                  {new Date(project.createdAt) > new Date(Date.now() - 86400000) && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Nuevo
                    </span>
                  )}
                </div>

                <p className="text-gray-600 flex-grow mb-4">
                  {project.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex gap-3 mb-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline text-sm"
                      >
                        Ver Demo ↗
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 font-medium hover:text-black hover:underline text-sm"
                      >
                        GitHub
                      </a>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 text-right">
                    Actualizado: {new Date(project.updatedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}