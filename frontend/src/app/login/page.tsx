'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Playfair_Display, Inter } from 'next/font/google';

// Configuración de fuentes
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      Cookies.set('token', data.access_token, { expires: 1 });

      router.push('/admin');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center bg-[#f4f3f0] text-[#1a1a1a] p-4 ${inter.className}`}>
      
      {/* 🎨 TEXTURA DE FONDO */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply fixed" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* TARJETA DE LOGIN */}
      <div className="relative z-10 w-full max-w-md bg-[#f4f3f0] border border-[#1a1a1a]/10 p-8 md:p-12 shadow-2xl shadow-[#1a1a1a]/5">
        
        <div className="text-center mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Restricted Area</p>
          <h1 className={`${playfair.className} text-4xl font-bold text-[#1a1a1a]`}>
            Welcome Back
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-800 text-xs font-mono text-center uppercase tracking-wide">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-300 focus:border-[#1a1a1a] focus:ring-0 outline-none transition-colors text-[#1a1a1a] placeholder-gray-400 font-light"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-300 focus:border-[#1a1a1a] focus:ring-0 outline-none transition-colors text-[#1a1a1a] placeholder-gray-400 font-light"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-4 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#1a1a1a] hover:bg-gray-800 hover:shadow-lg'
              }`}
          >
            {isLoading ? 'Authenticating...' : 'Enter System'}
          </button>
        </form>

        <div className="mt-8 text-center">
            <button onClick={() => router.push('/')} className="text-xs font-mono text-gray-400 hover:text-[#1a1a1a] border-b border-transparent hover:border-[#1a1a1a] transition-all">
                ← Return to Public Gallery
            </button>
        </div>
      </div>
    </div>
  );
}