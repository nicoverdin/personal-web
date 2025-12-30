'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: ''
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = Cookies.get('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    try {
      const res = await fetch(`${apiUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Error al crear proyecto');

      alert('¡Proyecto creado con éxito!');
      setFormData({ title: '', description: '', url: '' });
      
    } catch (error) {
      alert('Error: No tienes permisos o el token ha expirado.');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <button 
            onClick={() => {
              Cookies.remove('token');
              router.push('/');
            }}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Formulario de Creación */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Proyecto</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: Mi Portafolio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Breve descripción del proyecto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL (Opcional)</label>
              <input
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {isLoading ? 'Guardando...' : 'Publicar Proyecto'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}