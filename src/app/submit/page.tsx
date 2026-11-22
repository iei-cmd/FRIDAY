'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Sparkles, HardDrive, Info } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { SubmissionForm } from '@/components/submissions/SubmissionForm';
import { MemberProfile } from '@/lib/types';

export default function SubmitWorkPage() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.session?.profile) {
          setProfile(data.session.profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    }
    loadProfile();
  }, []);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Submit Committee Work Report
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Record activities, auto-calculate working hours, and archive PDF & files directly into Administrator&apos;s Google Drive
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-2 max-w-xs">
            <HardDrive className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-[11px] leading-tight">
              Auto-archived into <strong>IEI Data of Works</strong> with certified official PDF
            </span>
          </div>
        </div>

        {/* Submission Form Component */}
        <SubmissionForm memberProfile={profile} />
      </div>
    </AppShell>
  );
}
