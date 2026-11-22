'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Download,
  ExternalLink,
  PlusCircle,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  HardDrive,
  FileSpreadsheet,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { SubmissionDetailsModal } from '@/components/submissions/SubmissionDetailsModal';
import { WorkSubmission, MemberProfile, WorkCategory } from '@/lib/types';
import { formatDatePretty, formatTime12Hour } from '@/lib/time-utils';

export default function MyWorkHistoryPage() {
  const [submissions, setSubmissions] = useState<WorkSubmission[]>([]);
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApproval, setSelectedApproval] = useState('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'hours_desc'>('date_desc');

  // Modal
  const [selectedSubmission, setSelectedSubmission] = useState<WorkSubmission | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        setProfile(sessionData.session?.profile || null);

        const subRes = await fetch('/api/submissions');
        const subData = await subRes.json();
        setSubmissions(subData.submissions || []);

        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter personal submissions
  const mySubmissions = useMemo(() => {
    let list = profile
      ? submissions.filter((s) => s.member_id === profile.id || s.member_email === profile.gmail_address)
      : submissions;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.work_title.toLowerCase().includes(q) ||
          s.work_description.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((s) => s.category_id === selectedCategory || s.category_name === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      list = list.filter((s) => s.work_status === selectedStatus);
    }

    if (selectedApproval !== 'all') {
      list = list.filter((s) => s.approval_status === selectedApproval);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'hours_desc') return b.total_hours - a.total_hours;
      if (sortBy === 'date_asc') return new Date(a.work_date).getTime() - new Date(b.work_date).getTime();
      return new Date(b.work_date).getTime() - new Date(a.work_date).getTime();
    });

    return list;
  }, [submissions, profile, search, selectedCategory, selectedStatus, selectedApproval, sortBy]);

  const totalFilteredHours = Number(mySubmissions.reduce((acc, s) => acc + s.total_hours, 0).toFixed(2));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Committee Work History
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Complete chronological register of all submitted activities and verified working hours
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/submissions/export/excel?type=submissions"
              download
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Excel
            </a>

            <Link
              href="/submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Work
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search work title, description, or ID..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Approval Filter */}
            <div>
              <select
                value={selectedApproval}
                onChange={(e) => setSelectedApproval(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Approval States</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="hours_desc">Highest Hours</option>
              </select>
            </div>
          </div>

          {/* Filter Stats Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{mySubmissions.length}</strong> activities
            </span>
            <span>
              Filtered Hours Total:{' '}
              <strong className="text-sky-400 font-bold">{totalFilteredHours} hrs</strong>
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden backdrop-blur-xl">
          {mySubmissions.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No matching work submissions found.{' '}
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedApproval('all');
                }}
                className="text-sky-400 underline ml-1"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-semibold">Sub ID</th>
                    <th className="py-3 px-4 font-semibold">Work Title</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Date of Work</th>
                    <th className="py-3 px-4 font-semibold">Time Log</th>
                    <th className="py-3 px-4 font-semibold">Hours</th>
                    <th className="py-3 px-4 font-semibold">Approval</th>
                    <th className="py-3 px-4 font-semibold">Drive Doc</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {mySubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                        {sub.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white group-hover:text-sky-300 transition-colors max-w-xs truncate">
                        {sub.work_title}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {sub.category_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDatePretty(sub.work_date)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatTime12Hour(sub.start_time)} - {formatTime12Hour(sub.end_time)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sky-400 whitespace-nowrap">
                        {sub.total_hours} hrs
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
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
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`/api/submissions/export/pdf?id=${sub.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium"
                        >
                          <HardDrive className="w-3.5 h-3.5" /> PDF Report
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`/api/submissions/export/pdf?id=${sub.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
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

      {/* Modal */}
      <SubmissionDetailsModal
        submission={selectedSubmission}
        isOpen={Boolean(selectedSubmission)}
        isAdmin={false}
        onClose={() => setSelectedSubmission(null)}
      />
    </AppShell>
  );
}
