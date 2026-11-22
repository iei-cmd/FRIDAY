'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Users,
  HardDrive,
  Award,
  CheckCircle2,
  Table,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { MemberProfile } from '@/lib/types';

export default function AdminReportsPage() {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch('/api/members');
        const data = await res.json();
        setMembers(data.members || []);
        if (data.members?.length > 0) {
          setSelectedMemberId(data.members[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-emerald-400" />
            Consolidated Reports & Data Exporter
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export certified official committee documents, comprehensive Excel spreadsheets, and CSV datasets
          </p>
        </div>

        {/* Report Export Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Consolidated Committee Report (Excel) */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 backdrop-blur-xl transition-all space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Consolidated Committee Excel Workbook</h3>
                <p className="text-xs text-slate-400">Multi-sheet comprehensive executive dossier</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Includes Executive KPI summary sheet, complete chronological submissions register, verified committee member directory, and department ranking table.
            </p>

            <div className="pt-2">
              <a
                href="/api/submissions/export/excel?type=consolidated"
                download
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Consolidated Workbook (.xlsx)
              </a>
            </div>
          </div>

          {/* Card 2: All Submissions Register (Excel) */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 backdrop-blur-xl transition-all space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400">
                <Table className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">All Submissions Register</h3>
                <p className="text-xs text-slate-400">Formatted spreadsheet of all committee tasks</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Complete tabular listing with submission IDs, start/end timestamps, calculated duration decimals, locations, status flags, and Google Drive links.
            </p>

            <div className="pt-2 flex gap-3">
              <a
                href="/api/submissions/export/excel?type=submissions"
                download
                className="flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Excel (.xlsx)
              </a>

              <a
                href="/api/submissions/export/excel?type=csv"
                download
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                CSV Dataset
              </a>
            </div>
          </div>

          {/* Card 3: Committee Member Directory */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 backdrop-blur-xl transition-all space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Registered Member Directory</h3>
                <p className="text-xs text-slate-400">Official IEI chapter roster</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Complete faculty roster containing authenticated Gmail addresses, designations, academic departments, IEI membership numbers, and Google Drive IDs.
            </p>

            <div className="pt-2">
              <a
                href="/api/submissions/export/excel?type=members"
                download
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Member Roster (.xlsx)
              </a>
            </div>
          </div>

          {/* Card 4: Individual Member PDF & Excel Export */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 backdrop-blur-xl transition-all space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Individual Member Dossier</h3>
                <p className="text-xs text-slate-400">Filtered contributions by specific faculty</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Select Committee Member:</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} ({m.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href={`/api/submissions/export/excel?type=submissions&memberId=${selectedMemberId}`}
                download
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Member Excel
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
