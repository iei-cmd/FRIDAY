import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'purple' | 'emerald' | 'amber';
  badge?: string;
  badgePositive?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  badge,
  badgePositive = true,
}: StatsCardProps) {
  const colorMap = {
    blue: {
      bg: 'from-sky-500/10 via-blue-600/10 to-indigo-600/10',
      border: 'border-sky-500/20 hover:border-sky-500/40',
      iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(56,189,248,0.15)]',
    },
    purple: {
      bg: 'from-purple-500/10 via-indigo-600/10 to-pink-600/10',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)]',
    },
    emerald: {
      bg: 'from-emerald-500/10 via-teal-600/10 to-cyan-600/10',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(52,211,153,0.15)]',
    },
    amber: {
      bg: 'from-amber-500/10 via-orange-600/10 to-yellow-600/10',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(251,191,36,0.15)]',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${scheme.bg} bg-slate-900/80 p-5 backdrop-blur-xl border ${scheme.border} ${scheme.glow} transition-all duration-300 hover:translate-y-[-2px]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {badge && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              badgePositive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {badge}
          </span>
          <span className="text-[11px] text-slate-500">recorded in system</span>
        </div>
      )}
    </div>
  );
}
