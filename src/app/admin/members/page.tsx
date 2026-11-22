'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  HardDrive,
  Clock,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Eye,
  PlusCircle,
  Building,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { MemberProfile, WorkSubmission } from '@/lib/types';
import { formatDatePretty } from '@/lib/time-utils';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [submissions, setSubmissions] = useState<WorkSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedDesignation, setSelectedDesignation] = useState('all');

  // Member details drawer/modal
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);

  const loadData = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/submissions'),
      ]);
      const mData = await mRes.json();
      const sData = await sRes.json();
      setMembers(mData.members || []);
      setSubmissions(sData.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute stats per member
  const memberStats = useMemo(() => {
    const map = new Map<string, { totalHours: number; count: number; lastDate: string }>();
    for (const s of submissions) {
      const cur = map.get(s.member_id) || { totalHours: 0, count: 0, lastDate: s.work_date };
      cur.totalHours += s.total_hours;
      cur.count += 1;
      if (new Date(s.work_date) > new Date(cur.lastDate)) cur.lastDate = s.work_date;
      map.set(s.member_id, cur);
    }
    return map;
  }, [submissions]);

  // Unique departments and designations for dropdowns
  const departments = useMemo(() => {
    return Array.from(new Set(members.map((m) => m.department)));
  }, [members]);

  const designations = useMemo(() => {
    return Array.from(new Set(members.map((m) => m.designation)));
  }, [members]);

  const filteredMembers = useMemo(() => {
    let list = [...members];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.full_name.toLowerCase().includes(q) ||
          m.gmail_address.toLowerCase().includes(q) ||
          m.iei_membership_no?.toLowerCase().includes(q)
      );
    }
    if (selectedDept !== 'all') {
      list = list.filter((m) => m.department === selectedDept);
    }
    if (selectedDesignation !== 'all') {
      list = list.filter((m) => m.designation === selectedDesignation);
    }
    return list;
  }, [members, search, selectedDept, selectedDesignation]);

  const toggleMemberActive = async (id: string, currentState: boolean) => {
    try {
      await fetch(`/api/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentState }),
      });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_active: !currentState } : m))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-7 h-7 text-sky-400" />
              Committee Member Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active committee faculty roster, verified working hours, and individual Google Drive folders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/submissions/export/excel?type=members"
              download
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Roster (.xlsx)
            </a>

            <Link
              href="/register"
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Add Member
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member name, Gmail, or IEI membership no..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Designations</option>
              {designations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Member Table */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Member Name & Identity</th>
                  <th className="py-3.5 px-4 font-semibold">Designation</th>
                  <th className="py-3.5 px-4 font-semibold">Department</th>
                  <th className="py-3.5 px-4 font-semibold">IEI Membership No</th>
                  <th className="py-3.5 px-4 font-semibold">Total Hours</th>
                  <th className="py-3.5 px-4 font-semibold">Drive Vault</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((m) => {
                  const stat = memberStats.get(m.id) || { totalHours: 0, count: 0, lastDate: 'N/A' };
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs">
                            {m.full_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-sky-300 transition-colors">
                              {m.full_name}
                            </p>
                            <p className="text-[11px] text-slate-400">{m.gmail_address}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-200">
                        {m.designation}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                        {m.department}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-400">
                        {m.iei_membership_no || 'Registered'}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-bold text-sky-400 text-sm">{stat.totalHours.toFixed(1)} hrs</span>
                        <span className="text-[10px] text-slate-500 block">({stat.count} works)</span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`https://drive.google.com/drive/folders/${m.drive_folder_id || 'vault'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 text-sky-400 border border-sky-500/20 text-[11px] transition-colors"
                        >
                          <HardDrive className="w-3 h-3" />
                          <span>Open Drive</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleMemberActive(m.id, m.is_active)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.is_active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {m.is_active ? 'Active' : 'Deactivated'}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedMember(m)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                        >
                          Profile & History
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Member Details Drawer Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                  Committee Member Record
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedMember.full_name}</h3>
                <p className="text-xs text-slate-400">{selectedMember.gmail_address}</p>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Designation</span>
                <span className="font-semibold text-white mt-0.5 block">{selectedMember.designation}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Department</span>
                <span className="font-semibold text-white mt-0.5 block">{selectedMember.department}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">College</span>
                <span className="font-semibold text-white mt-0.5 block">{selectedMember.college}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Mobile</span>
                <span className="font-semibold text-white mt-0.5 block">{selectedMember.mobile_number}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">IEI Membership</span>
                <span className="font-semibold text-white mt-0.5 block">{selectedMember.iei_membership_no || 'Registered'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Joined On</span>
                <span className="font-semibold text-white mt-0.5 block">{formatDatePretty(selectedMember.date_of_joining)}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-white">
                  Drive Folder: IEI Data of Works / {selectedMember.full_name}
                </span>
              </div>
              <a
                href={`https://drive.google.com/drive/folders/${selectedMember.drive_folder_id || 'vault'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline font-bold flex items-center gap-1"
              >
                Open in Drive <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
