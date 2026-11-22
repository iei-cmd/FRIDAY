'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Sparkles, ArrowRight, Lock, CheckCircle2, User, Compass } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [customEmail, setCustomEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, role: 'administrator' | 'member', name: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (role === 'administrator') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Please provide a valid Gmail address.');
      return;
    }
    handleLogin(customEmail, 'member', customEmail.split('@')[0]);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="lg" showSubtitle={false} showBadge={true} href="/" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Sign In to FRIDAY
          </h2>
          <p className="text-xs text-slate-400">
            Faculty & Responsibility Integrated Data Analytics Yard
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-medium mt-1">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            The Institution of Engineers (India)
          </div>
        </div>

        {/* Google OAuth Button */}
        <div className="space-y-3 pt-2">
          <a
            href="/api/auth/google"
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all cursor-pointer"
          >
            {/* Google G Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continue with Google
          </a>

          <p className="text-[11px] text-center text-slate-500">
            Authenticate using your official or verified institutional Gmail
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Quick Instant Profiles
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Demo Fast Logins */}
        <div className="space-y-2">
          <button
            onClick={() => handleLogin('admin.iei@drmgrdu.ac.in', 'administrator', 'Sripriyan S')}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-purple-300">
                Sripriyan S
              </div>
              <div className="text-[10px] text-purple-400">
                Chairman / Chapter Administrator
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Admin
            </span>
          </button>

          <button
            onClick={() => handleLogin('k.ramesh@drmgrdu.ac.in', 'member', 'Dr. K. Ramesh')}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-sky-300">
                Dr. K. Ramesh
              </div>
              <div className="text-[10px] text-sky-400">
                Honorary Secretary (Mechanical)
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Member
            </span>
          </button>

          <button
            onClick={() => handleLogin('ananya.sharma@gmail.com', 'member', 'Prof. Ananya Sharma')}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-sky-300">
                Prof. Ananya Sharma
              </div>
              <div className="text-[10px] text-sky-400">
                Faculty Advisor (ECE)
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Member
            </span>
          </button>
        </div>

        {/* Custom Email Form */}
        <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-800/80 space-y-2">
          <label className="text-[11px] font-semibold text-slate-400">
            Sign in with Any Custom Gmail ID:
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="faculty.name@gmail.com"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
            >
              Go
            </button>
          </div>
        </form>

        {error && (
          <p className="text-xs text-red-400 text-center font-medium">{error}</p>
        )}

        {/* Registration Link */}
        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            First time logging in with your Google account?{' '}
            <Link href="/register" className="text-sky-400 hover:underline font-semibold">
              Complete Registration →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
