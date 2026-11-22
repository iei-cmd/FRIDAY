'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  Users,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Filter,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatsCard } from '@/components/analytics/StatsCard';
import { HoursChart } from '@/components/analytics/HoursChart';
import { CategoryChart } from '@/components/analytics/CategoryChart';
import { LeaderboardTable } from '@/components/analytics/LeaderboardTable';
import { AnalyticsSummary } from '@/lib/types';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'this_month' | 'last_30' | 'academic_year' | 'all'>('all');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setAnalytics(data.summary);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-sky-400" />
              Advanced Data Analytics Yard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deep committee operational metrics, department distributions, and temporal trends
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="all">All-Time Cumulative</option>
              <option value="academic_year">Academic Year 2026-27</option>
              <option value="last_30">Last 30 Days</option>
              <option value="this_month">November 2026</option>
            </select>

            <a
              href="/api/submissions/export/excel?type=consolidated"
              download
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Analytics (.xlsx)
            </a>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Working Hours"
            value={`${analytics?.total_hours || 0} hrs`}
            subtitle="Verified committee duration"
            icon={Clock}
            color="blue"
          />

          <StatsCard
            title="Total Submissions"
            value={analytics?.total_submissions || 0}
            subtitle={`${analytics?.completed_activities || 0} marked completed`}
            icon={BarChart3}
            color="purple"
          />

          <StatsCard
            title="Active Faculty This Month"
            value={analytics?.active_members_current_month || 0}
            subtitle="Logged contributions in Nov 2026"
            icon={Users}
            color="emerald"
          />

          <StatsCard
            title="Average Work Duration"
            value={`${
              analytics?.total_submissions
                ? (analytics.total_hours / analytics.total_submissions).toFixed(1)
                : '0'
            } hrs`}
            subtitle="Per verified activity"
            icon={TrendingUp}
            color="amber"
          />
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HoursChart
              data={analytics?.monthly_trends || []}
              title="6-Month Contribution Trajectory"
              subtitle="Working hours and submission count progression across the semester"
            />
          </div>

          <div>
            <CategoryChart
              data={analytics?.category_distribution || []}
              title="Distribution by Responsibility Category"
            />
          </div>
        </div>

        {/* Department-wise Participation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Breakdown */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl">
            <h4 className="text-base font-bold text-white tracking-tight mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Department-Wise Participation & Hours
            </h4>

            <div className="space-y-3">
              {analytics?.department_distribution?.map((dept, idx) => {
                const percentage = analytics.total_hours > 0
                  ? Math.round((dept.hours / analytics.total_hours) * 100)
                  : 0;
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-white">{dept.department}</span>
                      <span className="text-sky-400 font-bold">{dept.hours} hrs ({percentage}%)</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>{dept.members} registered members</span>
                      <span>Audited contributions</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Table */}
          <LeaderboardTable
            contributors={analytics?.top_contributors || []}
            title="Faculty & Member Contribution Rankings"
          />
        </div>
      </div>
    </AppShell>
  );
}
