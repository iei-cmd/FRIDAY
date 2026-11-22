import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showBadge?: boolean;
  href?: string;
  className?: string;
}

export function Logo({
  size = 'md',
  showSubtitle = true,
  showBadge = true,
  href = '/',
  className = '',
}: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* High-Tech Custom SVG Logo */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
        
        {/* Core emblem */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-xl"
        >
          {/* Engineering Gear/Hexagon Frame */}
          <polygon
            points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5"
            stroke="url(#blueVioletGrad)"
            strokeWidth="5"
            fill="#090E1A"
          />

          {/* Inner Analytics Bars */}
          <rect x="28" y="55" width="8" height="22" rx="2" fill="#38BDF8" />
          <rect x="41" y="42" width="8" height="35" rx="2" fill="#60A5FA" />
          <rect x="54" y="32" width="8" height="45" rx="2" fill="#818CF8" />
          <rect x="67" y="24" width="8" height="53" rx="2" fill="#A855F7" />

          {/* Dynamic Vector Curve & Core Node */}
          <path
            d="M 28 55 Q 48 38, 71 24"
            stroke="#F8FAFC"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="71" cy="24" r="5" fill="#38BDF8" stroke="#F8FAFC" strokeWidth="2" />

          {/* Gradients */}
          <defs>
            <linearGradient id="blueVioletGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#6366F1" />
              <stop offset="1" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-wider bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent ${titleSizes[size]}`}>
            FRIDAY
          </span>
          {showBadge && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              IEI
            </span>
          )}
        </div>

        {showSubtitle && (
          <span className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-tight leading-none mt-0.5">
            Faculty & Responsibility Integrated Data Analytics Yard
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-block">{content}</Link>;
  }

  return content;
}
