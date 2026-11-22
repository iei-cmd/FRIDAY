import React from 'react';
import Link from 'next/link';
import {
  Shield,
  HardDrive,
  Clock,
  FileText,
  BarChart3,
  CheckCircle2,
  Users,
  ArrowRight,
  FolderTree,
  Lock,
  Sparkles,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-sky-500 selection:text-slate-950 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo size="md" showSubtitle={true} showBadge={true} href="/" />

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5"
            >
              Enter Workspace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* IEI Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 mb-8 shadow-xl backdrop-blur-md">
          <Compass className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-white">The Institution of Engineers (India)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="text-sky-300">Official Committee Work Management Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-none">
          Every Task. Every Hour.{' '}
          <span className="block mt-2 bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Every Contribution.
          </span>
          <span className="text-3xl sm:text-5xl lg:text-6xl text-slate-300 font-extrabold block mt-2">
            One Intelligent Workspace.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          <strong className="text-slate-200">FRIDAY</strong> (Faculty & Responsibility Integrated Data Analytics Yard) is an intelligent committee management system built for IEI committee members to record activities, calculate working hours, generate certified PDF reports, and automatically organize supporting documents in the administrator&apos;s Google Drive.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            Continue with Google
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            Administrator Portal
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 font-semibold text-sm border border-slate-700/60 transition-all"
          >
            Member Dashboard
          </Link>
        </div>

        {/* Live Metrics Showcase Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <span className="text-2xl sm:text-3xl font-black text-sky-400">100%</span>
            <p className="text-xs text-slate-400 mt-1">Google Drive Automated Sync</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">24h+</span>
            <p className="text-xs text-slate-400 mt-1">Overnight Time Calculator</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">Instant</span>
            <p className="text-xs text-slate-400 mt-1">Certified PDF Reports</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">RLS</span>
            <p className="text-xs text-slate-400 mt-1">Role-Based Security</p>
          </div>
        </div>
      </section>

      {/* Google Drive Architecture Highlight */}
      <section className="relative z-10 py-16 bg-[#0a0f1d]/70 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold mb-3">
              <HardDrive className="w-3.5 h-3.5" /> Core System Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Centralized Administrator Google Drive Organization
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              FRIDAY isolates individual submissions and streams certified PDFs and attachments straight into the Administrator&apos;s authorized Google Drive vault under a hierarchical schema.
            </p>
          </div>

          {/* Drive Hierarchy Visualizer */}
          <div className="max-w-3xl mx-auto rounded-3xl bg-slate-950/90 border border-slate-800 p-6 sm:p-8 font-mono text-xs sm:text-sm shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-sky-400" />
                Google Drive Storage Blueprint
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Auto-Provisioned On Registration
              </span>
            </div>

            <div className="mt-5 space-y-2 text-slate-300">
              <div className="text-white font-bold flex items-center gap-2">
                📁 My Drive
              </div>
              <div className="pl-4 text-sky-400 font-bold flex items-center gap-2">
                └── 📁 <span className="underline">IEI Data of Works</span> <span className="text-[10px] text-slate-400 font-normal">(Root Admin Vault)</span>
              </div>
              <div className="pl-10 text-purple-300 flex items-center gap-2">
                ├── 📁 Sripriyan S <span className="text-[10px] text-slate-500">(Member Folder)</span>
              </div>
              <div className="pl-16 text-slate-400">├── 📄 Work Reports <span className="text-slate-500">(MemberName_WorkTitle_YYYY-MM-DD.pdf)</span></div>
              <div className="pl-16 text-slate-400">├── 📄 Supporting Documents <span className="text-slate-500">(Photos, Excel, Proofs)</span></div>
              <div className="pl-16 text-slate-400">└── 📄 Monthly Reports <span className="text-slate-500">(Summary Sheets)</span></div>

              <div className="pl-10 text-purple-300 pt-2 flex items-center gap-2">
                ├── 📁 Dr. K. Ramesh
              </div>
              <div className="pl-16 text-slate-400">├── 📄 Work Reports | ├── 📄 Supporting Documents | └── 📄 Monthly Reports</div>

              <div className="pl-10 text-purple-300 pt-2 flex items-center gap-2">
                └── 📁 All Other Registered Committee Members...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Feature Modules */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Academic & Committee Excellence
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Complete compliance with Institution of Engineers (India) operational standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 backdrop-blur-xl transition-all">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 w-fit mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Working-Hour Engine</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Automatic time calculation supporting multi-day and overnight sessions past midnight. Validates durations, converts to standard decimal hours, and records audited timestamps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 backdrop-blur-xl transition-all">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 w-fit mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Certified PDF Documentation</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generates formal IEI letterhead reports featuring member credentials, activity specs, verified digital signatures, and attached document inventories.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 backdrop-blur-xl transition-all">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 w-fit mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Advanced Data Analytics Yard</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Real-time analytics aggregating committee contribution leaderboards, department-wise participation, category distributions, and monthly hours trends.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#070b14] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" showSubtitle={true} showBadge={true} href="/" />

          <p className="text-xs text-slate-500 text-center sm:text-right">
            © 2026 The Institution of Engineers (India) • Project FRIDAY
            <span className="block text-[11px] text-slate-600 mt-0.5">
              Faculty & Responsibility Integrated Data Analytics Yard
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
