'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  HardDrive,
  MessageSquare,
  Loader2,
  AlertCircle,
  Download,
  ExternalLink,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { WorkSubmission } from '@/lib/types';
import { formatDatePretty, formatTime12Hour } from '@/lib/time-utils';

export default function AdminApprovalsPage() {
  const [submissions, setSubmissions] = useState<WorkSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions?approvalStatus=Pending');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleReview = async (id: string, status: 'Approved' | 'Rejected') => {
    setProcessingId(id);
    const feedback = feedbackInputs[id] || '';

    try {
      const res = await fetch(`/api/submissions/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_status: status,
          admin_feedback: feedback,
          reviewer_name: 'Administrator',
        }),
      });

      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <CheckSquare className="w-7 h-7 text-amber-400" />
              Submission Approvals Terminal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review, ratify, or request revisions on committee work reports and certified hour claims
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
            {submissions.length} Awaiting Action
          </span>
        </div>

        {/* Approvals List */}
        {submissions.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-12 text-center backdrop-blur-xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-bold text-white">All Clear!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are no pending submissions in the review pipeline. All committee activity reports have been processed.
            </p>
            <Link
              href="/admin/submissions"
              className="inline-block mt-4 text-xs text-sky-400 hover:underline font-semibold"
            >
              View all verified submissions →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const isProcessing = processingId === sub.id;
              return (
                <div
                  key={sub.id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-xl space-y-4 hover:border-slate-700 transition-all shadow-xl"
                >
                  {/* Top Bar: Member & Category */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold text-xs">
                        {sub.member_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{sub.member_name}</p>
                        <p className="text-[10px] text-slate-400">
                          {sub.member_designation} • {sub.member_department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {sub.category_name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Pending
                      </span>
                    </div>
                  </div>

                  {/* Title & Time Specs */}
                  <div>
                    <h3 className="text-base font-bold text-white">{sub.work_title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        {formatDatePretty(sub.work_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        {formatTime12Hour(sub.start_time)} to {formatTime12Hour(sub.end_time)}
                      </span>
                      <span className="font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/20">
                        {sub.total_hours} Hours Contributed
                      </span>
                    </div>
                  </div>

                  {/* Work Description */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {sub.work_description}
                  </div>

                  {/* Google Drive PDF link */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <HardDrive className="w-3.5 h-3.5 text-sky-400" />
                      <span>Drive Archive: {sub.pdf_file_name || 'Report.pdf'}</span>
                    </div>

                    <a
                      href={`/api/submissions/export/pdf?id=${sub.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Download className="w-3 h-3" /> Preview Official PDF
                    </a>
                  </div>

                  {/* Feedback Input & Action Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-3">
                    <input
                      type="text"
                      value={feedbackInputs[sub.id] || ''}
                      onChange={(e) =>
                        setFeedbackInputs({ ...feedbackInputs, [sub.id]: e.target.value })
                      }
                      placeholder="Add reviewer feedback, ratification notes, or comments (optional)..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />

                    <div className="flex items-center justify-end gap-3">
                      <button
                        disabled={isProcessing}
                        onClick={() => handleReview(sub.id, 'Rejected')}
                        className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 font-semibold text-xs border border-red-800/80 transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>

                      <button
                        disabled={isProcessing}
                        onClick={() => handleReview(sub.id, 'Approved')}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Approve & Ratify
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
