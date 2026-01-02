'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Playfair_Display, Inter } from 'next/font/google';

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

      Cookies.set('token', data.access_token, { expires: 1, sameSite: 'lax' });

      router.push('/admin');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center bg-[#f4f3f0] text-[#1a1a1a] p-6 ${inter.className}`}>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#f4f3f0] border border-[#1a1a1a]/10 p-8 md:p-12 shadow-2xl shadow-[#1a1a1a]/5 backdrop-blur-sm">
        
        <div className="text-center mb-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 mb-3">
             Encrypted Terminal
          </p>
          <h1 className={`${playfair.className} text-4xl font-bold text-[#1a1a1a] tracking-tight`}>
            Authorized Only
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-800 text-[10px] font-mono text-center uppercase tracking-widest animate-pulse">
            Access Denied: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Identity Identifier
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-[#1a1a1a] outline-none transition-all text-[#1a1a1a] placeholder-gray-300 font-light text-base" 
              placeholder="admin@nicolasverdin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Access Credentials
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-[#1a1a1a] outline-none transition-all text-[#1a1a1a] placeholder-gray-300 font-light text-base"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all duration-500 mt-4
              ${isLoading 
                ? 'bg-gray-300 cursor-wait' 
                : 'bg-[#1a1a1a] active:scale-[0.98] md:hover:bg-gray-800'
              }`}
          >
            {isLoading ? 'Verifying...' : 'Establish Connection'}
          </button>
        </form>

        <div className="mt-12 text-center">
            <button 
              onClick={() => router.push('/')} 
              className="text-[10px] font-mono text-gray-400 hover:text-[#1a1a1a] border-b border-transparent hover:border-[#1a1a1a] transition-all uppercase tracking-widest"
            >
                ← Exit to Public Archive
            </button>
        </div>
      </div>
    </div>
  );
}