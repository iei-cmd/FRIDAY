'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  FileText,
  Clock,
  CheckSquare,
  HardDrive,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatsCard } from '@/components/analytics/StatsCard';
import { HoursChart } from '@/components/analytics/HoursChart';
import { CategoryChart } from '@/components/analytics/CategoryChart';
import { LeaderboardTable } from '@/components/analytics/LeaderboardTable';
import { SubmissionDetailsModal } from '@/components/submissions/SubmissionDetailsModal';
import { AnalyticsSummary, WorkSubmission, MemberProfile } from '@/lib/types';
import { formatDatePretty, formatTime12Hour } from '@/lib/time-utils';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [submissions, setSubmissions] = useState<WorkSubmission[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<WorkSubmission | null>(null);

  const loadData = async () => {
    try {
      const [analyticsRes, subRes, memRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/submissions'),
        fetch('/api/members'),
      ]);

      const analyticsData = await analyticsRes.json();
      const subData = await subRes.json();
      const memData = await memRes.json();

      setAnalytics(analyticsData.summary);
      setSubmissions(subData.submissions || []);
      setMembers(memData.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingSubmissions = submissions.filter((s) => s.approval_status === 'Pending');

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Administrator Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-blue-950/70 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-3">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Executive Council & Chapter Administrator Control Center</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                FRIDAY Command & Analytics Yard
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
                The Institution of Engineers (India) • Live oversight of member activities, verified working hours, approval pipelines, and Google Drive vault archives
              </p>
            </div>

            {/* Admin Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/admin/approvals"
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <CheckSquare className="w-4 h-4" />
                Approvals ({pendingSubmissions.length})
              </Link>

              <Link
                href="/admin/drive"
                className="px-4 py-2.5 rounded-2xl bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 font-semibold text-xs border border-sky-500/30 transition-all flex items-center gap-1.5"
              >
                <HardDrive className="w-4 h-4 text-sky-400" />
                Google Drive Vault
              </Link>

              <Link
                href="/admin/reports"
                className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Consolidated Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Core System Statistics Cards (7 KPIs from Section 7) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Registered Members"
            value={analytics?.total_members || members.length}
            subtitle="Committee faculty & officers"
            icon={Users}
            color="blue"
            badge="100% Active"
          />

          <StatsCard
            title="Total Working Hours"
            value={`${analytics?.total_hours || 0} hrs`}
            subtitle="Audited contribution time"
            icon={Clock}
            color="purple"
            badge="Across All Departments"
          />

          <StatsCard
            title="Total Work Submissions"
            value={analytics?.total_submissions || submissions.length}
            subtitle={`${analytics?.completed_activities || 0} Completed`}
            icon={FileText}
            color="emerald"
            badge="Certified Reports"
          />

          <StatsCard
            title="Approval Queue"
            value={`${pendingSubmissions.length} Pending`}
            subtitle="Awaiting administrative review"
            icon={CheckSquare}
            color="amber"
            badge={pendingSubmissions.length > 0 ? 'Action Required' : 'All Clear'}
            badgePositive={pendingSubmissions.length === 0}
          />
        </div>

        {/* Charts & Leaderboard Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HoursChart
              data={analytics?.monthly_trends || []}
              title="Chapter Monthly Hours Contribution"
              subtitle="Collective committee hours logged across all registered members"
            />
          </div>

          <div>
            <CategoryChart
              data={analytics?.category_distribution || []}
              title="Activity Category Distribution"
            />
          </div>
        </div>

        {/* Top Contributors & Pending Queue Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Top Contributors Leaderboard */}
          <LeaderboardTable
            contributors={analytics?.top_contributors || []}
            title="Member Contribution Rankings"
          />

          {/* Right: Submissions Awaiting Approval Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                  Submissions Awaiting Review
                </h4>
                <Link
                  href="/admin/approvals"
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                >
                  View queue ({pendingSubmissions.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                  All submissions are currently reviewed and up to date!
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSubmissions.slice(0, 4).map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-white truncate">{sub.work_title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {sub.member_name} • <span className="text-sky-400">{sub.category_name}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-amber-400 block">{sub.total_hours} hrs</span>
                        <span className="text-[10px] text-slate-500">{formatDatePretty(sub.work_date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Auto-Notification active on approval</span>
              <Link href="/admin/approvals" className="text-amber-400 hover:underline font-semibold">
                Open Review Terminal →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <SubmissionDetailsModal
        submission={selectedSubmission}
        isOpen={Boolean(selectedSubmission)}
        isAdmin={true}
        onClose={() => setSelectedSubmission(null)}
        onReviewed={() => loadData()}
      />
    </AppShell>
  );
}
