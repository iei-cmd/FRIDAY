'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileSpreadsheet,
  HardDrive,
  User,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { SubmissionDetailsModal } from '@/components/submissions/SubmissionDetailsModal';
import { WorkSubmission, MemberProfile, WorkCategory } from '@/lib/types';
import { formatDatePretty, formatTime12Hour } from '@/lib/time-utils';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<WorkSubmission[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApproval, setSelectedApproval] = useState('all');

  const [selectedSubmission, setSelectedSubmission] = useState<WorkSubmission | null>(null);

  const loadData = async () => {
    try {
      const [sRes, mRes, cRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/members'),
        fetch('/api/categories'),
      ]);
      const sData = await sRes.json();
      const mData = await mRes.json();
      const cData = await cRes.json();
      setSubmissions(sData.submissions || []);
      setMembers(mData.members || []);
      setCategories(cData.categories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSubmissions = useMemo(() => {
    let list = [...submissions];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.work_title.toLowerCase().includes(q) ||
          s.member_name.toLowerCase().includes(q) ||
          s.work_description.toLowerCase().includes(q)
      );
    }

    if (selectedMember !== 'all') {
      list = list.filter((s) => s.member_id === selectedMember);
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

    return list;
  }, [submissions, search, selectedMember, selectedCategory, selectedStatus, selectedApproval]);

  const totalFilteredHours = Number(
    filteredSubmissions.reduce((acc, s) => acc + s.total_hours, 0).toFixed(2)
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-sky-400" />
              All Committee Submissions Register
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Global registry of activities recorded by all committee members with Google Drive PDF links
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

            <a
              href="/api/submissions/export/excel?type=csv"
              download
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              CSV Dataset
            </a>
          </div>
        </div>

        {/* Deep Filtering Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, member, desc..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Member Filter */}
            <div>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Members</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name}
                  </option>
                ))}
              </select>
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

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Needs Review">Needs Review</option>
              </select>
            </div>

            {/* Approval Filter */}
            <div>
              <select
                value={selectedApproval}
                onChange={(e) => setSelectedApproval(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Approvals</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredSubmissions.length}</strong> of{' '}
              {submissions.length} submissions
            </span>
            <span>
              Total Verified Duration:{' '}
              <strong className="text-sky-400 font-bold">{totalFilteredHours} hrs</strong>
            </span>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Activity & Details</th>
                  <th className="py-3.5 px-4 font-semibold">Member</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Date & Time Log</th>
                  <th className="py-3.5 px-4 font-semibold">Duration</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Approval</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                        {sub.work_title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {sub.work_location || 'Campus'}
                      </p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-200">{sub.member_name}</p>
                      <p className="text-[10px] text-slate-400">{sub.member_department}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {sub.category_name}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                      <div>{formatDatePretty(sub.work_date)}</div>
                      <div className="text-[10px] text-slate-500">
                        {formatTime12Hour(sub.start_time)} - {formatTime12Hour(sub.end_time)}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-sky-400 whitespace-nowrap">
                      {sub.total_hours} hrs
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-300">
                      {sub.work_status}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
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

                    <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/submissions/export/pdf?id=${sub.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
