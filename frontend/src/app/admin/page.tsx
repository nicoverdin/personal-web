'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

type Project = { 
  id: string; 
  title: string; 
  description: string; 
  url: string;
  image: string;
  repoUrl: string;
};

// Actualizado con excerpt y coverImage
type Article = { 
  id: string; 
  title: string; 
  slug: string; 
  content: string; 
  excerpt?: string; 
  coverImage?: string; 
  tags: any[]; 
  isVisible: boolean 
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'articles'>('projects');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [articlesList, setArticlesList] = useState<Article[]>([]);

  const [projectData, setProjectData] = useState({ 
    title: '', description: '', url: '', image: '', repoUrl: '' 
  });
  
  // 1. Añadidos campos al estado inicial de artículos
  const [articleData, setArticleData] = useState({ 
    title: '', slug: '', content: '', excerpt: '', coverImage: '', tags: '', isVisible: false 
  });

  const [isUploading, setIsUploading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchData('projects', setProjectsList);
    fetchData('articles', setArticlesList);
  }, [activeTab]);

  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  const fetchData = async (endpoint: string, setList: Function) => {
    try {
      const res = await fetch(`${apiUrl}/${endpoint}`);
      if (res.ok) setList(await res.json());
    } catch (e) { console.error("Error loading list"); }
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      await fetch(`${apiUrl}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (endpoint === 'projects') fetchData('projects', setProjectsList);
      else fetchData('articles', setArticlesList);
    } catch (error) { alert('Error deleting item'); }
  };

  const startEditing = (item: any, type: 'project' | 'article') => {
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (type === 'project') {
      setProjectData({ 
        title: item.title, 
        description: item.description, 
        url: item.url || '',
        image: item.image || '',
        repoUrl: item.repoUrl || ''
      });
    } else {
      // 2. Cargar datos de edición incluyendo los nuevos campos
      setArticleData({
        title: item.title,
        slug: item.slug,
        content: item.content,
        excerpt: item.excerpt || '',
        coverImage: item.coverImage || '',
        tags: item.tags ? (Array.isArray(item.tags) ? item.tags.map((t:any) => t.name || t).join(', ') : '') : '',
        isVisible: item.isVisible
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setProjectData({ title: '', description: '', url: '', image: '', repoUrl: '' });
    setArticleData({ title: '', slug: '', content: '', excerpt: '', coverImage: '', tags: '', isVisible: false });
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendData('projects', projectData);
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData: any = { ...articleData };
    if (!editingId) {
       formattedData.tags = articleData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
    }
    await sendData('articles', formattedData);
  };

  const sendData = async (endpoint: string, data: any) => {
    setIsLoading(true);
    const cleanData = { ...data };

    // 3. Limpieza de strings vacíos para evitar errores de base de datos
    if (endpoint === 'projects') {
        if (cleanData.url === '') cleanData.url = null;
        if (cleanData.image === '') cleanData.image = null;
        if (cleanData.repoUrl === '') cleanData.repoUrl = null;
    } else {
        if (cleanData.excerpt === '') cleanData.excerpt = null;
        if (cleanData.coverImage === '') cleanData.coverImage = null;
    }

    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `${apiUrl}/${endpoint}/${editingId}` : `${apiUrl}/${endpoint}`;

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanData),
      });
      if (!res.ok) throw new Error('Request error');
      
      alert(editingId ? 'Updated! 🔄' : 'Created! 🎉');
      resetForm();
      if (endpoint === 'projects') fetchData('projects', setProjectsList);
      else fetchData('articles', setArticlesList);
    } catch (error) { alert('Error. Check your data.'); } 
    finally { setIsLoading(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'projects' | 'articles') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Cookies.get('token')}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      if (type === 'projects') {
        setProjectData(prev => ({ ...prev, image: data.url }));
      } else {
        setArticleData(prev => ({ ...prev, coverImage: data.url }));
      }

    } catch (error) {
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-400 focus:border-[#1a1a1a] focus:ring-0 outline-none transition-all font-light text-sm";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

  return (
    <div className={`min-h-screen bg-[#f4f3f0] p-6 md:p-12 text-[#1a1a1a] ${inter.className}`}>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-[#1a1a1a]/10 pb-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">System Control</p>
            <h1 className={`${playfair.className} text-4xl font-bold text-[#1a1a1a]`}>Admin Dashboard</h1>
          </div>
          <button onClick={() => { Cookies.remove('token'); router.push('/'); }} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 transition-all border border-transparent hover:border-red-100">Logout</button>
        </div>

        <div className="flex space-x-8 mb-8">
          <button onClick={() => { setActiveTab('projects'); resetForm(); }} className={`pb-2 text-sm uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'border-b-2 border-[#1a1a1a] font-bold text-[#1a1a1a]' : 'text-gray-400 hover:text-gray-600'}`}>Projects</button>
          <button onClick={() => { setActiveTab('articles'); resetForm(); }} className={`pb-2 text-sm uppercase tracking-widest transition-all ${activeTab === 'articles' ? 'border-b-2 border-[#1a1a1a] font-bold text-[#1a1a1a]' : 'text-gray-400 hover:text-gray-600'}`}>Articles</button>
        </div>

        <div className="bg-white border border-[#1a1a1a]/5 p-8 shadow-xl shadow-[#1a1a1a]/5 mb-12 relative">
          <div className="flex justify-between items-baseline mb-8 border-b border-gray-100 pb-4">
            <h2 className={`${playfair.className} text-2xl font-bold text-[#1a1a1a]`}>
              {editingId ? `Editing ${activeTab === 'projects' ? 'Project' : 'Article'}` : `New Entry: ${activeTab === 'projects' ? 'Project' : 'Article'}`}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs font-mono text-gray-400 hover:text-[#1a1a1a] border-b border-gray-300 hover:border-[#1a1a1a] transition-all">Cancel Editing</button>
            )}
          </div>

          {activeTab === 'projects' && (
            <form onSubmit={handleProjectSubmit} className="space-y-6">
              <div>
                <label className={labelClass}>Project Title</label>
                <input className={inputClass} placeholder="e.g. Minimalist E-commerce" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} required />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea className={inputClass} placeholder="Brief overview of the project..." rows={3} value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className={labelClass}>Live URL</label>
                   <input className={inputClass} placeholder="https://..." value={projectData.url} onChange={e => setProjectData({...projectData, url: e.target.value})} />
                </div>
                <div>
                   <label className={labelClass}>Repository URL</label>
                   <input className={inputClass} placeholder="https://github.com/..." value={projectData.repoUrl} onChange={e => setProjectData({...projectData, repoUrl: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Cover Image</label>
                <div className="flex gap-4 items-center">
                  <label className={`cursor-pointer flex items-center gap-2 px-4 py-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors rounded ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">{isUploading ? 'Uploading...' : 'Choose File'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'projects')} disabled={isUploading} />
                  </label>
                  {projectData.image && (
                    <div className="flex items-center gap-2">
                      <img src={projectData.image} alt="Preview" className="h-10 w-10 object-cover rounded border border-gray-200" />
                      <button type="button" onClick={() => setProjectData({...projectData, image: ''})} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button disabled={isLoading} className={`w-full py-3 px-6 text-xs font-bold uppercase tracking-widest text-white transition-all ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#1a1a1a] hover:bg-gray-800'}`}>
                {isLoading ? 'Processing...' : (editingId ? 'Update Project' : 'Save Project')}
              </button>
            </form>
          )}

          {activeTab === 'articles' && (
            <form onSubmit={handleArticleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Title</label>
                  <input className={inputClass} placeholder="Article Title" value={articleData.title} onChange={e => setArticleData({...articleData, title: e.target.value})} required />
                </div>
                <div>
                  <label className={labelClass}>Slug</label>
                  <input className={inputClass} placeholder="my-article-slug" value={articleData.slug} onChange={e => setArticleData({...articleData, slug: e.target.value})} required />
                </div>
              </div>

              {/* 4. NUEVOS CAMPOS EN EL FORMULARIO DE ARTÍCULOS */}
              <div>
                <label className={labelClass}>Excerpt (Brief Summary)</label>
                <textarea className={inputClass} placeholder="A short summary of the article..." rows={2} value={articleData.excerpt} onChange={e => setArticleData({...articleData, excerpt: e.target.value})} />
              </div>

              <div>
                <label className={labelClass}>Cover Image</label>
                <div className="flex gap-4 items-center">
                  <label className={`cursor-pointer flex items-center gap-2 px-4 py-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors rounded ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">{isUploading ? 'Uploading...' : 'Choose File'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'articles')} disabled={isUploading} />
                  </label>
                  {articleData.coverImage && (
                    <div className="flex items-center gap-2">
                      <img src={articleData.coverImage} alt="Preview" className="h-10 w-10 object-cover rounded border border-gray-200" />
                      <button type="button" onClick={() => setArticleData({...articleData, coverImage: ''})} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Content (Markdown)</label>
                <textarea className={`${inputClass} font-mono text-xs leading-relaxed`} placeholder="# Write something amazing..." rows={12} value={articleData.content} onChange={e => setArticleData({...articleData, content: e.target.value})} required />
              </div>
              
              {!editingId && (
                  <div>
                    <label className={labelClass}>Tags (Comma separated)</label>
                    <input className={inputClass} placeholder="React, Design, Tutorial..." value={articleData.tags} onChange={e => setArticleData({...articleData, tags: e.target.value})} />
                  </div>
              )}
              
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="visible" className="w-4 h-4 accent-[#1a1a1a]" checked={articleData.isVisible} onChange={e => setArticleData({...articleData, isVisible: e.target.checked})} />
                <label htmlFor="visible" className="text-sm font-medium text-[#1a1a1a]">Publish immediately</label>
              </div>
              
              <button disabled={isLoading} className={`w-full py-3 px-6 text-xs font-bold uppercase tracking-widest text-white transition-all ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#1a1a1a] hover:bg-gray-800'}`}>
                {isLoading ? 'Processing...' : (editingId ? 'Update Article' : 'Publish Article')}
              </button>
            </form>
          )}
        </div>

        {/* LISTADO DE ITEMS */}
        <div>
           <div className="flex items-center gap-4 mb-6">
              <h3 className={`${playfair.className} text-xl font-bold text-[#1a1a1a]`}>Library Archive</h3>
              <div className="h-[1px] bg-gray-200 flex-grow"></div>
           </div>

           <div className="space-y-3">
               {/* Lista Proyectos */}
               {activeTab === 'projects' && Array.isArray(projectsList) && projectsList.map(p => (
               <div key={p.id} className="bg-white p-5 border border-gray-100 flex justify-between items-center group hover:border-[#1a1a1a]/20 transition-all">
                   <div>
                   <p className="font-bold text-[#1a1a1a] mb-1">{p.title}</p>
                   <div className="flex gap-3 text-[10px] uppercase tracking-wider text-gray-400">
                       {p.url && <a href={p.url} target="_blank" className="hover:text-[#1a1a1a]">Live View ↗</a>}
                       {p.repoUrl && <a href={p.repoUrl} target="_blank" className="hover:text-[#1a1a1a]">Source ↗</a>}
                   </div>
                   </div>
                   <div className="flex gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => startEditing(p, 'project')} className="text-amber-600 hover:text-amber-800 font-mono text-xs">[ Edit ]</button>
                   <button onClick={() => handleDelete('projects', p.id)} className="text-red-500 hover:text-red-700 font-mono text-xs">[ Delete ]</button>
                   </div>
               </div>
               ))}
               
               {/* Lista Artículos */}
               {activeTab === 'articles' && Array.isArray(articlesList) && articlesList.map(a => (
               <div key={a.id} className="bg-white p-5 border border-gray-100 flex justify-between items-center group hover:border-[#1a1a1a]/20 transition-all">
                   <div>
                   <div className="flex items-center gap-3 mb-1">
                       <p className="font-bold text-[#1a1a1a]">{a.title}</p>
                       <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border ${a.isVisible ? 'border-green-200 text-green-700 bg-green-50' : 'border-gray-200 text-gray-500 bg-gray-50'}`}>
                       {a.isVisible ? 'Published' : 'Draft'}
                       </span>
                   </div>
                   <p className="text-xs font-mono text-gray-400">/{a.slug}</p>
                   </div>
                   <div className="flex gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => startEditing(a, 'article')} className="text-amber-600 hover:text-amber-800 font-mono text-xs">[ Edit ]</button>
                   <button onClick={() => handleDelete('articles', a.id)} className="text-red-500 hover:text-red-700 font-mono text-xs">[ Delete ]</button>
                   </div>
               </div>
               ))}
           </div>
        </div>
      </div>
    </div>
  );
}