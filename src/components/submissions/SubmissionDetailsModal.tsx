'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
  HardDrive,
  User,
  Building,
  MapPin,
  Tag,
  MessageSquare,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { WorkSubmission, WorkAttachment } from '@/lib/types';
import { formatDatePretty, formatTime12Hour } from '@/lib/time-utils';

interface SubmissionDetailsModalProps {
  submission: WorkSubmission | null;
  isOpen: boolean;
  isAdmin?: boolean;
  onClose: () => void;
  onReviewed?: (updated: WorkSubmission) => void;
}

export function SubmissionDetailsModal({
  submission,
  isOpen,
  isAdmin = false,
  onClose,
  onReviewed,
}: SubmissionDetailsModalProps) {
  const [feedback, setFeedback] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  if (!isOpen || !submission) return null;

  const handleReview = async (status: 'Approved' | 'Rejected') => {
    setReviewing(true);
    setReviewError(null);
    try {
      const res = await fetch(`/api/submissions/${submission.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_status: status,
          admin_feedback: feedback,
          reviewer_name: 'Administrator',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to review submission');
      }

      if (onReviewed) onReviewed(data.submission);
      onClose();
    } catch (err: any) {
      setReviewError(err.message || 'Error updating approval');
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {submission.category_name}
              </span>
              {getStatusBadge(submission.approval_status)}
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {submission.work_title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Profile Capsule */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold">
              {submission.member_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{submission.member_name}</p>
              <p className="text-slate-400">{submission.member_designation} • {submission.member_department}</p>
              <p className="text-[11px] text-sky-400">{submission.member_email}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-400 text-[11px] block">Time Contributed</span>
            <span className="text-lg font-black text-sky-400">
              {submission.hours_spent || Math.floor(submission.total_hours)}h {submission.minutes_spent || Math.round((submission.total_hours % 1) * 60)}m
            </span>
            <span className="text-[10px] text-slate-500 block">({submission.total_hours} hrs decimal)</span>
          </div>
        </div>

        {/* Work Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-400" /> Date of Work
            </span>
            <span className="font-semibold text-white mt-1 block">
              {formatDatePretty(submission.work_date)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" /> Time Log
            </span>
            <span className="font-semibold text-white mt-1 block">
              {formatTime12Hour(submission.start_time)} - {formatTime12Hour(submission.end_time)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sky-400" /> Location
            </span>
            <span className="font-semibold text-white mt-1 block truncate">
              {submission.work_location || 'Campus'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
              <Tag className="w-3 h-3 text-sky-400" /> Work Status
            </span>
            <span className="font-semibold text-white mt-1 block">
              {submission.work_status}
            </span>
          </div>
        </div>

        {/* Detailed Work Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Detailed Narrative & Scope of Work
          </h4>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {submission.work_description}
          </div>
        </div>

        {/* Remarks / Event */}
        {(submission.related_event || submission.remarks) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {submission.related_event && (
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Related Event</span>
                <p className="text-slate-200 font-medium mt-0.5">{submission.related_event}</p>
              </div>
            )}
            {submission.remarks && (
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Member Remarks</span>
                <p className="text-slate-200 font-medium mt-0.5">{submission.remarks}</p>
              </div>
            )}
          </div>
        )}

        {/* Google Drive Official PDF & Vault Links */}
        <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Administrator Google Drive Archive</p>
              <p className="text-[11px] text-slate-400">
                PDF: {submission.pdf_file_name || `${submission.member_name}_Report.pdf`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`/api/submissions/export/pdf?id=${submission.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>

            {submission.pdf_drive_url && (
              <a
                href={submission.pdf_drive_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View in Drive
              </a>
            )}
          </div>
        </div>

        {/* Admin Review / Feedback Block */}
        {submission.admin_feedback && (
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Administrative Feedback & Notes
            </div>
            <p className="text-xs text-amber-200">{submission.admin_feedback}</p>
            {submission.reviewed_by && (
              <p className="text-[10px] text-amber-400/80 mt-1">
                Reviewed by: {submission.reviewed_by}
              </p>
            )}
          </div>
        )}

        {/* Administrator Approval Actions (Shown for Admins on Pending or re-evaluating) */}
        {isAdmin && (
          <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Administrator Approval & Feedback Action
              </span>
            </div>

            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide administrative remarks, verification notes, or feedback for the member..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-purple-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />

            {reviewError && (
              <p className="text-xs text-red-400 font-medium">{reviewError}</p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={reviewing}
                onClick={() => handleReview('Rejected')}
                className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 font-semibold text-xs border border-red-800/80 transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject Submission
              </button>

              <button
                type="button"
                disabled={reviewing}
                onClick={() => handleReview('Approved')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                {reviewing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                Approve & Ratify Work
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
