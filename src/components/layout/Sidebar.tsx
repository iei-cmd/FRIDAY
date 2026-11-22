'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  BarChart3,
  Bell,
  User,
  Settings,
  Users,
  CheckSquare,
  HardDrive,
  FileSpreadsheet,
  Sliders,
  Shield,
  X,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '../brand/Logo';

interface SidebarProps {
  isAdmin?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isAdmin = false, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const memberNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Submit Work', href: '/submit', icon: PlusCircle, highlight: true },
    { label: 'My Work History', href: '/my-work', icon: FileText },
    { label: 'My Analytics', href: '/my-analytics', icon: BarChart3 },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'My Profile', href: '/my-profile', icon: User },
  ];

  const adminNavItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'All Members', href: '/admin/members', icon: Users },
    { label: 'All Submissions', href: '/admin/submissions', icon: FileText },
    { label: 'Approvals Queue', href: '/admin/approvals', icon: CheckSquare, badge: 'Pending' },
    { label: 'Advanced Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Reports & Exports', href: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Google Drive', href: '/admin/drive', icon: HardDrive, glow: true },
    { label: 'System Settings', href: '/admin/settings', icon: Sliders },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#0a0f1d] border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/80 bg-[#070b14]/50">
          <Logo size="sm" showSubtitle={true} showBadge={true} href="/" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Member Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Member Workspace
            </div>
            <nav className="space-y-1">
              {memberNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      active
                        ? 'bg-gradient-to-r from-sky-500/15 to-blue-600/15 text-sky-300 border border-sky-500/30 font-semibold shadow-sm'
                        : item.highlight
                        ? 'text-sky-400 hover:text-sky-300 hover:bg-sky-950/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          active
                            ? 'text-sky-400'
                            : item.highlight
                            ? 'text-sky-400'
                            : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.highlight && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-sky-500 text-[#070b14] uppercase tracking-wide">
                        New
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Administrator Portal Section */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-purple-400" />
                Administrator Portal
              </span>
              {isAdmin && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              )}
            </div>

            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      active
                        ? 'bg-gradient-to-r from-purple-500/20 to-indigo-600/20 text-purple-300 border border-purple-500/40 font-semibold shadow-sm'
                        : item.glow
                        ? 'text-sky-400 hover:text-sky-300 hover:bg-sky-950/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          active
                            ? 'text-purple-400'
                            : item.glow
                            ? 'text-sky-400'
                            : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}

                    {item.glow && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        Drive
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Organization Card */}
        <div className="p-4 border-t border-slate-800/80 bg-[#070b14]/40">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white">IEI Student Chapter</span>
              <span className="text-[9px] text-sky-400 font-semibold">Verified</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
              Dr. M.G.R. Educational and Research Institute
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>Drive Sync: Active</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
