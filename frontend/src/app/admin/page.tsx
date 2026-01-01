'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Definimos tipos básicos para TypeScript
type Project = { id: string; title: string; description: string; url: string };
type Article = { id: string; title: string; slug: string; content: string; tags: string[]; isVisible: boolean };

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'articles'>('projects');
  const [isLoading, setIsLoading] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [articlesList, setArticlesList] = useState<Article[]>([]);

  const [projectData, setProjectData] = useState({ title: '', description: '', url: '' });
  const [articleData, setArticleData] = useState({ 
    title: '', slug: '', content: '', tags: '', isVisible: false 
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // 1. Cargar datos al entrar o cambiar de pestaña
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) router.push('/login');
    else {
      fetchData('projects', setProjectsList);
      fetchData('articles', setArticlesList);
    }
  }, [router, activeTab]); // Recargar si cambia la pestaña

  // --- FUNCIONES DE AYUDA ---

  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  const fetchData = async (endpoint: string, setList: Function) => {
    try {
      const res = await fetch(`${apiUrl}/${endpoint}`);
      if (res.ok) setList(await res.json());
    } catch (e) { console.error("Error cargando lista"); }
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm('¿Seguro que quieres borrar esto? 😱')) return;
    
    try {
      await fetch(`${apiUrl}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (endpoint === 'projects') fetchData('projects', setProjectsList);
      else fetchData('articles', setArticlesList);
    } catch (error) { alert('Error al borrar'); }
  };

  const startEditing = (item: any, type: 'project' | 'article') => {
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (type === 'project') {
      setProjectData({ title: item.title, description: item.description, url: item.url || '' });
    } else {
      setArticleData({
        title: item.title,
        slug: item.slug,
        content: item.content,
        tags: item.tags ? item.tags.join(', ') : '',
        isVisible: item.isVisible
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setProjectData({ title: '', description: '', url: '' });
    setArticleData({ title: '', slug: '', content: '', tags: '', isVisible: false });
  };

  // --- SUBMITS ---

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendData('projects', projectData);
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...articleData,
      // tags: articleData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };
    await sendData('articles', formattedData);
  };

  const sendData = async (endpoint: string, data: any) => {
    setIsLoading(true);
    // Lógica mágica: Si hay ID es PATCH (Editar), si no es POST (Crear)
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `${apiUrl}/${endpoint}/${editingId}` : `${apiUrl}/${endpoint}`;

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error('Error en la petición');
      
      alert(editingId ? '¡Actualizado! 🔄' : '¡Creado! 🎉');
      resetForm();
      
      // Recargar lista
      if (endpoint === 'projects') fetchData('projects', setProjectsList);
      else fetchData('articles', setArticlesList);

    } catch (error) {
      alert('Error. Revisa tu sesión o los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <button onClick={() => { Cookies.remove('token'); router.push('/'); }} className="text-red-600 hover:text-red-800">Salir</button>
        </div>

        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button onClick={() => { setActiveTab('projects'); resetForm(); }} className={`pb-2 px-4 ${activeTab === 'projects' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}>Proyectos</button>
          <button onClick={() => { setActiveTab('articles'); resetForm(); }} className={`pb-2 px-4 ${activeTab === 'articles' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}>Artículos</button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? `Editando ${activeTab === 'projects' ? 'Proyecto' : 'Artículo'} #${editingId}` : `Crear Nuevo ${activeTab === 'projects' ? 'Proyecto' : 'Artículo'}`}
            </h2>
            {editingId && <button onClick={resetForm} className="text-sm text-gray-500 underline">Cancelar edición</button>}
          </div>

          {activeTab === 'projects' && (
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <input className={inputClass} placeholder="Título" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} required />
              <textarea className={inputClass} placeholder="Descripción" rows={3} value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} required />
              <input className={inputClass} placeholder="URL Imagen" value={projectData.url} onChange={e => setProjectData({...projectData, url: e.target.value})} />
              <button disabled={isLoading} className={`w-full text-white py-2 px-4 rounded-lg font-medium transition ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isLoading ? 'Procesando...' : (editingId ? 'Actualizar Proyecto' : 'Guardar Proyecto')}
              </button>
            </form>
          )}

          {activeTab === 'articles' && (
            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className={inputClass} placeholder="Título" value={articleData.title} onChange={e => setArticleData({...articleData, title: e.target.value})} required />
                <input className={inputClass} placeholder="Slug" value={articleData.slug} onChange={e => setArticleData({...articleData, slug: e.target.value})} required />
              </div>
              <textarea className={`${inputClass} font-mono text-sm`} placeholder="# Markdown..." rows={10} value={articleData.content} onChange={e => setArticleData({...articleData, content: e.target.value})} required />
              <input className={inputClass} placeholder="Tags (React, Docker...)" value={articleData.tags} onChange={e => setArticleData({...articleData, tags: e.target.value})} />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="visible" className="w-4 h-4" checked={articleData.isVisible} onChange={e => setArticleData({...articleData, isVisible: e.target.checked})} />
                <label htmlFor="visible" className="text-gray-700">Publicar</label>
              </div>
              <button disabled={isLoading} className={`w-full text-white py-2 px-4 rounded-lg font-medium transition ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {isLoading ? 'Procesando...' : (editingId ? 'Actualizar Artículo' : 'Publicar Artículo')}
              </button>
            </form>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-700 mb-4">
          Gestionar {activeTab === 'projects' ? 'Proyectos' : 'Artículos'} Existentes
        </h3>

        <div className="space-y-4">
          {activeTab === 'projects' && projectsList.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">{p.title}</p>
                <p className="text-sm text-gray-500 truncate max-w-md">{p.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEditing(p, 'project')} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200">✏️ Editar</button>
                <button onClick={() => handleDelete('projects', p.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">🗑️ Borrar</button>
              </div>
            </div>
          ))}

          {activeTab === 'articles' && articlesList.map(a => (
            <div key={a.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900">{a.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${a.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    {a.isVisible ? 'Público' : 'Borrador'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">/{a.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEditing(a, 'article')} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200">✏️ Editar</button>
                <button onClick={() => handleDelete('articles', a.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">🗑️ Borrar</button>
              </div>
            </div>
          ))}

          {activeTab === 'projects' && projectsList.length === 0 && <p className="text-gray-400 text-center">No hay proyectos.</p>}
          {activeTab === 'articles' && articlesList.length === 0 && <p className="text-gray-400 text-center">No hay artículos.</p>}
        </div>
      </div>
    </div>
  );
}