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
      
      alert(editingId ? 'Updated!' : 'Created!');
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

  const inputClass = "w-full p-4 border border-gray-200 bg-white text-[#1a1a1a] placeholder-gray-300 focus:border-[#1a1a1a] outline-none transition-all font-light text-base"; // text-base evita zoom en iOS
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2";

  return (
    <div className={`min-h-screen bg-[#f4f3f0] p-4 md:p-12 text-[#1a1a1a] ${inter.className}`}>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-[#1a1a1a]/10 pb-6 gap-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">System Control</p>
            <h1 className={`${playfair.className} text-3xl md:text-4xl font-bold text-[#1a1a1a]`}>Admin Dashboard</h1>
          </div>
          <button onClick={() => { Cookies.remove('token'); router.push('/'); }} className="w-full md:w-auto text-[10px] font-bold uppercase tracking-widest text-red-500 border border-red-200 px-6 py-3 md:py-2 transition-all active:bg-red-50">Logout</button>
        </div>

        <div className="flex space-x-8 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => { setActiveTab('projects'); resetForm(); }} className={`pb-2 text-[10px] uppercase tracking-[0.2em] transition-all shrink-0 ${activeTab === 'projects' ? 'border-b-2 border-[#1a1a1a] font-bold text-[#1a1a1a]' : 'text-gray-400'}`}>Projects</button>
          <button onClick={() => { setActiveTab('articles'); resetForm(); }} className={`pb-2 text-[10px] uppercase tracking-[0.2em] transition-all shrink-0 ${activeTab === 'articles' ? 'border-b-2 border-[#1a1a1a] font-bold text-[#1a1a1a]' : 'text-gray-400'}`}>Articles</button>
        </div>

        <div className="bg-white border border-[#1a1a1a]/5 p-5 md:p-8 shadow-xl shadow-[#1a1a1a]/5 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-8 border-b border-gray-100 pb-4 gap-4">
            <h2 className={`${playfair.className} text-xl md:text-2xl font-bold text-[#1a1a1a]`}>
              {editingId ? `Editing ${activeTab === 'projects' ? 'Project' : 'Article'}` : `New ${activeTab === 'projects' ? 'Project' : 'Article'}`}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-[10px] font-mono text-gray-400 border-b border-gray-300">Cancel Editing</button>
            )}
          </div>

          {activeTab === 'projects' && (
            <form onSubmit={handleProjectSubmit} className="space-y-6">
              <div>
                <label className={labelClass}>Project Title</label>
                <input className={inputClass} placeholder="Title" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} required />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea className={inputClass} placeholder="Overview..." rows={4} value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className={labelClass}>Live URL</label>
                   <input className={inputClass} type="url" placeholder="https://..." value={projectData.url} onChange={e => setProjectData({...projectData, url: e.target.value})} />
                </div>
                <div>
                   <label className={labelClass}>Repository</label>
                   <input className={inputClass} type="url" placeholder="https://github..." value={projectData.repoUrl} onChange={e => setProjectData({...projectData, repoUrl: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Visual Asset</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <label className={`w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 bg-white active:bg-gray-50 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'projects')} disabled={isUploading} />
                  </label>
                  {projectData.image && (
                    <div className="flex items-center gap-4 w-full sm:w-auto p-2 border border-gray-100 rounded">
                      <img src={projectData.image} alt="Preview" className="h-12 w-12 object-cover" />
                      <button type="button" onClick={() => setProjectData({...projectData, image: ''})} className="text-red-500 text-[10px] uppercase font-bold">Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <button disabled={isLoading} className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all active:scale-[0.98] ${editingId ? 'bg-amber-600' : 'bg-[#1a1a1a]'}`}>
                {isLoading ? 'Processing...' : (editingId ? 'Update Entry' : 'Commit Entry')}
              </button>
            </form>
          )}

          {activeTab === 'articles' && (
            <form onSubmit={handleArticleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Title</label>
                  <input className={inputClass} value={articleData.title} onChange={e => setArticleData({...articleData, title: e.target.value})} required />
                </div>
                <div>
                  <label className={labelClass}>Slug</label>
                  <input className={inputClass} value={articleData.slug} onChange={e => setArticleData({...articleData, slug: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className={labelClass}>Summary</label>
                <textarea className={inputClass} rows={3} value={articleData.excerpt} onChange={e => setArticleData({...articleData, excerpt: e.target.value})} />
              </div>

              <div>
                <label className={labelClass}>Cover Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <label className={`w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 bg-white active:bg-gray-50 ${isUploading ? 'opacity-50' : ''}`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'articles')} disabled={isUploading} />
                  </label>
                  {articleData.coverImage && (
                    <div className="flex items-center gap-4 p-2 border border-gray-100">
                      <img src={articleData.coverImage} alt="Preview" className="h-12 w-12 object-cover" />
                      <button type="button" onClick={() => setArticleData({...articleData, coverImage: ''})} className="text-red-500 text-[10px] font-bold uppercase">Remove</button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Manifesto Content (Markdown)</label>
                <textarea className={`${inputClass} font-mono text-[13px] leading-relaxed`} placeholder="# Content..." rows={15} value={articleData.content} onChange={e => setArticleData({...articleData, content: e.target.value})} required />
              </div>
              
              {!editingId && (
                  <div>
                    <label className={labelClass}>Classification Tags</label>
                    <input className={inputClass} placeholder="Security, AI, Rust..." value={articleData.tags} onChange={e => setArticleData({...articleData, tags: e.target.value})} />
                  </div>
              )}
              
              <div className="flex items-center gap-4 py-4 border-y border-gray-50">
                <input type="checkbox" id="visible" className="w-5 h-5 accent-[#1a1a1a]" checked={articleData.isVisible} onChange={e => setArticleData({...articleData, isVisible: e.target.checked})} />
                <label htmlFor="visible" className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">Visible in Public Manifesto</label>
              </div>
              
              <button disabled={isLoading} className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white active:scale-[0.98] ${editingId ? 'bg-amber-600' : 'bg-[#1a1a1a]'}`}>
                {isLoading ? 'Processing...' : (editingId ? 'Update Article' : 'Publish Article')}
              </button>
            </form>
          )}
        </div>

        <div>
           <div className="flex items-center gap-4 mb-8">
              <h3 className={`${playfair.className} text-lg md:text-xl font-bold text-[#1a1a1a]`}>Library Archive</h3>
              <div className="h-px bg-gray-200 grow"></div>
           </div>

           <div className="grid grid-cols-1 gap-4">
               {activeTab === 'projects' && Array.isArray(projectsList) && projectsList.map(p => (
               <div key={p.id} className="bg-white p-5 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group">
                   <div className="w-full">
                    <p className="font-bold text-[#1a1a1a] text-lg mb-2">{p.title}</p>
                    <div className="flex flex-wrap gap-4 text-[9px] uppercase tracking-wider text-gray-400">
                        {p.url && <a href={p.url} target="_blank" className="hover:text-black">Demo ↗</a>}
                        {p.repoUrl && <a href={p.repoUrl} target="_blank" className="hover:text-black">GitHub ↗</a>}
                    </div>
                   </div>
                   <div className="flex gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <button onClick={() => startEditing(p, 'project')} className="flex-1 sm:flex-none text-amber-600 text-[10px] font-bold uppercase tracking-widest py-2">Edit</button>
                    <button onClick={() => handleDelete('projects', p.id)} className="flex-1 sm:flex-none text-red-500 text-[10px] font-bold uppercase tracking-widest py-2">Delete</button>
                   </div>
               </div>
               ))}
               
               {activeTab === 'articles' && Array.isArray(articlesList) && articlesList.map(a => (
               <div key={a.id} className="bg-white p-5 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group">
                   <div className="w-full">
                    <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                        <p className="font-bold text-[#1a1a1a] text-lg">{a.title}</p>
                        <span className={`text-[8px] uppercase tracking-[0.2em] px-2 py-1 border ${a.isVisible ? 'border-green-100 text-green-600' : 'border-gray-200 text-gray-400'}`}>
                        {a.isVisible ? 'Live' : 'Draft'}
                        </span>
                    </div>
                    <p className="text-[10px] font-mono text-gray-400">slug: /{a.slug}</p>
                   </div>
                   <div className="flex gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <button onClick={() => startEditing(a, 'article')} className="flex-1 sm:flex-none text-amber-600 text-[10px] font-bold uppercase tracking-widest py-2">Edit</button>
                    <button onClick={() => handleDelete('articles', a.id)} className="flex-1 sm:flex-none text-red-500 text-[10px] font-bold uppercase tracking-widest py-2">Delete</button>
                   </div>
               </div>
               ))}
           </div>
        </div>
      </div>
    </div>
  );
}