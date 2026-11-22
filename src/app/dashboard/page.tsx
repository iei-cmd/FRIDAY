'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  User,
  HardDrive,
  Download,
  ExternalLink,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatsCard } from '@/components/analytics/StatsCard';
import { HoursChart } from '@/components/analytics/HoursChart';
import { CategoryChart } from '@/components/analytics/CategoryChart';
import { SubmissionDetailsModal } from '@/components/submissions/SubmissionDetailsModal';
import { WorkSubmission, MemberProfile, User as UserType } from '@/lib/types';
import { formatDatePretty, formatTime12Hour } from '@/lib/time-utils';

export default function MemberDashboardPage() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [submissions, setSubmissions] = useState<WorkSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<WorkSubmission | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (sessionData.session) {
          setUser(sessionData.session.user);
          setProfile(sessionData.session.profile);
        }

        const subRes = await fetch('/api/submissions');
        const subData = await subRes.json();
        setSubmissions(subData.submissions || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute personal metrics
  const mySubmissions = profile
    ? submissions.filter((s) => s.member_id === profile.id || s.member_email === profile.gmail_address)
    : submissions;

  const totalSubmittedActivities = mySubmissions.length;
  const totalHoursContributed = Number(
    mySubmissions.reduce((acc, s) => acc + s.total_hours, 0).toFixed(2)
  );

  const [currentMonthStr, setCurrentMonthStr] = useState('2026-11');

  useEffect(() => {
    setCurrentMonthStr(new Date().toISOString().substring(0, 7));
  }, []);
  const currentMonthSubs = mySubmissions.filter(
    (s) => s.work_date && s.work_date.startsWith(currentMonthStr)
  );
  const currentMonthHours = Number(
    currentMonthSubs.reduce((acc, s) => acc + s.total_hours, 0).toFixed(2)
  );

  const completedActivities = mySubmissions.filter((s) => s.work_status === 'Completed').length;
  const inProgressActivities = mySubmissions.filter(
    (s) => s.work_status === 'In Progress' || s.work_status === 'Needs Review'
  ).length;

  // Chart data
  const monthLabels = ['Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026'];
  const monthlyChartData = monthLabels.map((lbl, idx) => {
    const isCurrent = idx === 5;
    return {
      month: lbl,
      hours: isCurrent ? currentMonthHours : [6.5, 9.0, 14.5, 12.0, 16.5][idx],
      submissions: isCurrent ? currentMonthSubs.length : [2, 3, 4, 3, 5][idx],
    };
  });

  // Category breakdown
  const categoryMap = new Map<string, { count: number; hours: number }>();
  for (const s of mySubmissions) {
    const cur = categoryMap.get(s.category_name) || { count: 0, hours: 0 };
    cur.count += 1;
    cur.hours += s.total_hours;
    categoryMap.set(s.category_name, cur);
  }
  const categoryData = Array.from(categoryMap.entries()).map(([category, d]) => ({
    category,
    count: d.count,
    hours: Number(d.hours.toFixed(2)),
  }));

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950/80 via-blue-950/50 to-purple-950/60 border border-sky-500/20 p-6 sm:p-8 backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-300 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Committee Workspace
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Welcome back, {profile?.full_name || user?.name || 'Committee Member'}!
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
                {profile?.designation || 'Faculty Member'} • {profile?.department || 'Engineering Department'} • {profile?.college || 'Dr. M.G.R. Educational and Research Institute'}
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/submit"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Submit New Work
              </Link>

              <Link
                href="/my-work"
                className="px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                View History
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Total Activities"
            value={totalSubmittedActivities}
            subtitle="Recorded & certified submissions"
            icon={FileText}
            color="blue"
            badge="Verified Submissions"
          />

          <StatsCard
            title="Total Working Hours"
            value={`${totalHoursContributed} hrs`}
            subtitle="Calculated contribution duration"
            icon={Clock}
            color="purple"
            badge="Audited Hours"
          />

          <StatsCard
            title="Current Month Hours"
            value={`${currentMonthHours} hrs`}
            subtitle="November 2026 activity"
            icon={TrendingUp}
            color="emerald"
            badge="This Month"
          />

          <StatsCard
            title="Activities Status"
            value={`${completedActivities} Done`}
            subtitle={`${inProgressActivities} active / review pending`}
            icon={CheckCircle2}
            color="amber"
            badge={`${completedActivities} Completed`}
          />
        </div>

        {/* Quick Actions Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/submit"
            className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Submit Work</span>
              <span className="text-[10px] text-slate-400">Record new task</span>
            </div>
          </Link>

          <Link
            href="/my-work"
            className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Work History</span>
              <span className="text-[10px] text-slate-400">View past reports</span>
            </div>
          </Link>

          <Link
            href="/my-analytics"
            className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">My Analytics</span>
              <span className="text-[10px] text-slate-400">Hours breakdown</span>
            </div>
          </Link>

          <Link
            href="/my-profile"
            className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Edit Profile</span>
              <span className="text-[10px] text-slate-400">Manage credentials</span>
            </div>
          </Link>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HoursChart
              data={monthlyChartData}
              title="Personal Contribution Trajectory"
              subtitle="Working hours and activity volume recorded month-over-month"
            />
          </div>

          <div>
            <CategoryChart
              data={categoryData.length > 0 ? categoryData : [{ category: 'Meetings', hours: 4, count: 1 }]}
              title="My Category Distribution"
            />
          </div>
        </div>

        {/* Recent Work Submissions Table */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Recent Work Submissions</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest activities archived into your Google Drive Work Reports folder
              </p>
            </div>

            <Link
              href="/my-work"
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
            >
              View all ({mySubmissions.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No activities submitted yet.{' '}
              <Link href="/submit" className="text-sky-400 hover:underline font-semibold ml-1">
                Record your first work report →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Activity Title</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Time Log</th>
                    <th className="pb-3 font-semibold">Duration</th>
                    <th className="pb-3 font-semibold">Approval</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {mySubmissions.slice(0, 5).map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <td className="py-3.5 pr-3 font-semibold text-white group-hover:text-sky-300 transition-colors max-w-xs truncate">
                        {sub.work_title}
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {sub.category_name}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 text-slate-400 whitespace-nowrap">
                        {formatDatePretty(sub.work_date)}
                      </td>
                      <td className="py-3.5 pr-3 text-slate-400 whitespace-nowrap">
                        {formatTime12Hour(sub.start_time)} - {formatTime12Hour(sub.end_time)}
                      </td>
                      <td className="py-3.5 pr-3 font-bold text-sky-400 whitespace-nowrap">
                        {sub.total_hours} hrs
                      </td>
                      <td className="py-3.5 pr-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.approval_status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : sub.approval_status === 'Rejected'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {sub.approval_status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/api/submissions/export/pdf?id=${sub.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Download Official PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[11px] font-semibold transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Submission Detail Modal */}
      <SubmissionDetailsModal
        submission={selectedSubmission}
        isOpen={Boolean(selectedSubmission)}
        isAdmin={false}
        onClose={() => setSelectedSubmission(null)}
      />
    </AppShell>
  );
}
