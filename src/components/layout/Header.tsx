'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Shield,
  User as UserIcon,
  HardDrive,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { User, MemberProfile } from '@/lib/types';

interface HeaderProps {
  user?: User | null;
  profile?: MemberProfile | null;
  isAdmin?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({
  user,
  profile,
  isAdmin = false,
  onToggleSidebar,
}: HeaderProps) {
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const switchAccount = async (email: string, role: 'administrator' | 'member', name: string) => {
    setIsSwitching(true);
    try {
      await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, name }),
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
      setIsSwitching(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Toggle & Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              The Institution of Engineers (India)
            </span>
            <span className="text-[11px] text-slate-400">
              FRIDAY Work Management & Analytics Yard
            </span>
          </div>
        </div>

        {/* Right: Quick Role Switcher, Google Drive Quick Link, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Role Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Switch Role:</span>
              <span className={`font-semibold ${isAdmin ? 'text-purple-400' : 'text-sky-400'}`}>
                {isAdmin ? 'Admin' : 'Member'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
            </button>

            {/* Switcher Menu */}
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Instant Demo Profiles
              </div>

              <button
                onClick={() => switchAccount('admin.iei@drmgrdu.ac.in', 'administrator', 'Sripriyan S')}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">Sripriyan S</div>
                  <div className="text-[10px] text-purple-400">Chairman (Administrator)</div>
                </div>
                {isAdmin && <span className="w-2 h-2 rounded-full bg-purple-400" />}
              </button>

              <button
                onClick={() => switchAccount('k.ramesh@drmgrdu.ac.in', 'member', 'Dr. K. Ramesh')}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">Dr. K. Ramesh</div>
                  <div className="text-[10px] text-sky-400">Honorary Secretary (Member)</div>
                </div>
                {!isAdmin && profile?.gmail_address === 'k.ramesh@drmgrdu.ac.in' && (
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                )}
              </button>

              <button
                onClick={() => switchAccount('ananya.sharma@gmail.com', 'member', 'Prof. Ananya Sharma')}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">Prof. Ananya Sharma</div>
                  <div className="text-[10px] text-sky-400">Faculty Advisor (Member)</div>
                </div>
                {profile?.gmail_address === 'ananya.sharma@gmail.com' && (
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                )}
              </button>

              <div className="border-t border-slate-800 my-1" />

              <Link
                href="/register"
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-sky-400 hover:bg-sky-950/40 transition-colors block font-medium"
              >
                + Register New Member
              </Link>
            </div>
          </div>

          {/* Administrator Google Drive Direct Link */}
          <Link
            href="/admin/drive"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-sky-950/40 text-sky-300 hover:text-white hover:bg-sky-900/60 border border-sky-500/20 transition-all"
            title="Google Drive Vault"
          >
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xl:inline">IEI Data of Works</span>
          </Link>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <Link
              href={isAdmin ? '/admin' : '/my-profile'}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/60 transition-colors group"
            >
              <div className="relative">
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-sky-400 transition-colors"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#070b14] ${
                    isAdmin ? 'bg-purple-500' : 'bg-emerald-500'
                  }`}
                />
              </div>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                  {user?.name || 'Sripriyan S'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {profile?.designation || (isAdmin ? 'Administrator' : 'Committee Member')}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
