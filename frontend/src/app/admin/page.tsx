'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'articles'>('projects');
  const [isLoading, setIsLoading] = useState(false);

  const [projectData, setProjectData] = useState({ title: '', description: '', url: '' });
  
  const [articleData, setArticleData] = useState({ 
    title: '', 
    slug: '', 
    content: '', 
    tags: '', 
    isVisible: false 
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) router.push('/login');
  }, [router]);

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendData('projects', projectData);
    setProjectData({ title: '', description: '', url: '' });
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...articleData,
      tags: articleData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };
    await sendData('articles', formattedData);
    setArticleData({ title: '', slug: '', content: '', tags: '', isVisible: false });
  };

  const sendData = async (endpoint: string, data: any) => {
    setIsLoading(true);
    const token = Cookies.get('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    try {
      const res = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al guardar');
      alert('¡Creado con éxito! 🎉');
    } catch (error) {
      alert('Error al crear. Revisa tu sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <button onClick={() => { Cookies.remove('token'); router.push('/'); }} className="text-red-600 font-medium hover:text-red-800">
            Salir
          </button>
        </div>

        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`pb-2 px-4 transition-colors ${activeTab === 'projects' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Proyectos
          </button>
          <button 
            onClick={() => setActiveTab('articles')}
            className={`pb-2 px-4 transition-colors ${activeTab === 'articles' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Artículos (Blog)
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {activeTab === 'projects' && (
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Nuevo Proyecto</h2>
              <input 
                className={inputClass}
                placeholder="Título del Proyecto" 
                value={projectData.title}
                onChange={e => setProjectData({...projectData, title: e.target.value})} 
                required 
              />
              <textarea 
                className={inputClass}
                placeholder="Descripción del proyecto..." 
                rows={3}
                value={projectData.description}
                onChange={e => setProjectData({...projectData, description: e.target.value})} 
                required 
              />
              <input 
                className={inputClass}
                placeholder="URL de Imagen (http://...)" 
                value={projectData.url}
                onChange={e => setProjectData({...projectData, url: e.target.value})} 
              />
              <button disabled={isLoading} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full transition font-medium">
                {isLoading ? 'Guardando...' : 'Guardar Proyecto'}
              </button>
            </form>
          )}

          {activeTab === 'articles' && (
            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Nuevo Artículo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  className={inputClass}
                  placeholder="Título del Artículo" 
                  value={articleData.title}
                  onChange={e => setArticleData({...articleData, title: e.target.value})} 
                  required 
                />
                <input 
                  className={inputClass}
                  placeholder="Slug (ej: mi-nuevo-post)" 
                  value={articleData.slug}
                  onChange={e => setArticleData({...articleData, slug: e.target.value})} 
                  required 
                />
              </div>
              
              <textarea 
                className={`${inputClass} font-mono text-sm`} 
                placeholder="# Escribe aquí en Markdown..." 
                rows={10}
                value={articleData.content}
                onChange={e => setArticleData({...articleData, content: e.target.value})} 
                required 
              />
              
              <input 
                className={inputClass}
                placeholder="Tags separados por coma (Ej: React, Tutorial)" 
                value={articleData.tags}
                onChange={e => setArticleData({...articleData, tags: e.target.value})} 
              />

              <div className="flex items-center gap-2 p-2">
                <input 
                  type="checkbox" 
                  id="visible"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={articleData.isVisible}
                  onChange={e => setArticleData({...articleData, isVisible: e.target.checked})}
                />
                <label htmlFor="visible" className="text-gray-700 cursor-pointer select-none">Publicar inmediatamente</label>
              </div>

              <button disabled={isLoading} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 w-full transition font-medium">
                {isLoading ? 'Publicando...' : 'Publicar Artículo'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}