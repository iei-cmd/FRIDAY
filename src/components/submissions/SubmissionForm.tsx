'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Calendar,
  CheckCircle2,
  HardDrive,
  FileText,
  AlertCircle,
  Sparkles,
  Send,
  Loader2,
  ExternalLink,
  MapPin,
  Tag,
  Building,
  User,
  Mail,
  Briefcase,
} from 'lucide-react';
import { FileUploadZone, AttachmentPayload } from './FileUploadZone';
import { calculateWorkingHours, formatTime12Hour } from '@/lib/time-utils';
import { WorkCategory, MemberProfile } from '@/lib/types';

interface SubmissionFormProps {
  memberProfile?: MemberProfile | null;
  onSuccess?: () => void;
}

export function SubmissionForm({ memberProfile, onSuccess }: SubmissionFormProps) {
  const router = useRouter();

  // Categories list
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form states
  const [workTitle, setWorkTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workDate, setWorkDate] = useState('2026-11-22');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('17:00');
  const [workStatus, setWorkStatus] = useState<'Completed' | 'In Progress' | 'Needs Review'>('Completed');
  const [workLocation, setWorkLocation] = useState('Offline Campus (Dr. M.G.R. Campus)');
  const [relatedEvent, setRelatedEvent] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachments, setAttachments] = useState<AttachmentPayload[]>([]);

  // Submission process states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<any | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          if (data.categories?.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // Automatic Working Hour Calculation
  const durationCalc = useMemo(() => {
    return calculateWorkingHours(startTime, endTime);
  }, [startTime, endTime]);

  // Selected Category Object
  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId) || categories[0];
  }, [categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!workTitle.trim()) {
      setSubmitError('Please provide a title for the activity.');
      return;
    }
    if (!workDescription.trim()) {
      setSubmitError('Please provide a detailed work description.');
      return;
    }
    if (!durationCalc.valid) {
      setSubmitError(durationCalc.error || 'Please correct the time duration.');
      return;
    }

    setSubmitting(true);

    try {
      const email = memberProfile?.gmail_address || 'admin.iei@drmgrdu.ac.in';

      const payload = {
        member_email: email,
        work_title: workTitle,
        category_id: selectedCategory?.id || 'cat-1',
        category_name: selectedCategory?.name || 'General Committee Responsibility',
        work_description: workDescription,
        work_date: workDate,
        start_time: startTime,
        end_time: endTime,
        work_status: workStatus,
        work_location: workLocation,
        related_event: relatedEvent || undefined,
        remarks: remarks || undefined,
        attachments: attachments,
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit work report.');
      }

      setSubmitSuccess(data);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setWorkTitle('');
    setWorkDescription('');
    setRelatedEvent('');
    setRemarks('');
    setAttachments([]);
    setSubmitSuccess(null);
    setSubmitError(null);
  };

  if (submitSuccess) {
    return (
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 text-center max-w-2xl mx-auto backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight">
          Work Report Successfully Archived!
        </h3>
        <p className="text-slate-400 text-sm mt-2">
          Your committee contribution has been recorded in the database, authenticated into an official IEI PDF report, and organized in the Administrator&apos;s Google Drive folder.
        </p>

        {/* Generated PDF & Drive Info Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400">PDF Report Document:</span>
            <span className="font-semibold text-sky-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {submitSuccess.pdfFileName}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400">Hours Logged:</span>
            <span className="font-bold text-white">
              {submitSuccess.calculation?.formatted_duration} ({submitSuccess.calculation?.total_hours} hrs)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Administrator Google Drive Vault:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" /> Archived in IEI Data of Works
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`/api/submissions/export/pdf?id=${submitSuccess.submission?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            Download Official PDF
          </a>

          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Submit Another Activity
          </button>

          <button
            onClick={() => router.push('/my-work')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
          >
            View My Work History →
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SECTION A: Auto-Populated Member Information Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800/90 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Authenticated Committee Member Profile
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            Verified Identity (Locked)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">Full Name:</span>
            <span className="font-semibold text-white truncate block">
              {memberProfile?.full_name || 'Sripriyan S'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block">Gmail Address:</span>
            <span className="font-semibold text-sky-400 truncate block">
              {memberProfile?.gmail_address || 'admin.iei@drmgrdu.ac.in'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block">Designation / Posting:</span>
            <span className="font-semibold text-white truncate block">
              {memberProfile?.designation || 'Chairman / Administrator'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block">Department:</span>
            <span className="font-semibold text-white truncate block">
              {memberProfile?.department || 'Computer Science & Engineering'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION B: Work Details */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            Activity & Work Details
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Record comprehensive specifics of the committee task or event carried out
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Work Title */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Work Title / Activity Heading <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={workTitle}
              onChange={(e) => setWorkTitle(e.target.value)}
              placeholder="e.g. Conducted Technical Workshop on AI & Cloud Architecture"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Work Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Work Category <span className="text-red-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date, Location, and Related Event */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Date of Activity <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Location / Platform
            </label>
            <input
              type="text"
              value={workLocation}
              onChange={(e) => setWorkLocation(e.target.value)}
              placeholder="e.g. Offline Campus Lab, Zoom, State Centre"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Related Event / Initiative (Optional)
            </label>
            <input
              type="text"
              value={relatedEvent}
              onChange={(e) => setRelatedEvent(e.target.value)}
              placeholder="e.g. National Engineers Day 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* SECTION C: Working-Hour Calculation Box */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Working Hours Calculation
              </span>
            </div>
            {durationCalc.is_overnight && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                Overnight Session Handled (Past Midnight)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Start Time */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Start Time (24h)</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-sky-500"
              />
              <span className="text-[10px] text-slate-500">
                {formatTime12Hour(startTime)}
              </span>
            </div>

            {/* End Time */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">End Time (24h)</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-sky-500"
              />
              <span className="text-[10px] text-slate-500">
                {formatTime12Hour(endTime)}
              </span>
            </div>

            {/* Computed Duration Card */}
            <div className="sm:col-span-2 p-3 rounded-xl bg-slate-900/90 border border-sky-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Computed Contribution Time
                </span>
                <span className="text-xl font-black text-sky-400 tracking-tight">
                  {durationCalc.valid ? durationCalc.formatted_duration : '--'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Decimal Total</span>
                <span className="text-sm font-bold text-white">
                  {durationCalc.valid ? `${durationCalc.total_hours} hrs` : '--'}
                </span>
              </div>
            </div>
          </div>

          {!durationCalc.valid && durationCalc.error && (
            <p className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {durationCalc.error}
            </p>
          )}
        </div>

        {/* Detailed Work Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Detailed Work Description & Narrative <span className="text-red-400">*</span>
            </label>
            <span className="text-[11px] text-slate-500">
              {workDescription.length} characters
            </span>
          </div>
          <textarea
            required
            rows={4}
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            placeholder="Describe the activities executed, agenda items resolved, participant counts, committee deliverables achieved, or technical outcomes..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Status & Remarks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Current Work Status</label>
            <select
              value={workStatus}
              onChange={(e) => setWorkStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Remarks / Follow-up Notes (Optional)
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Next review scheduled for upcoming Monday"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION D: Supporting Documents & Google Drive Auto-Upload */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              Supporting Documents & Evidence
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              All attached files are safely organized in the Administrator&apos;s Google Drive folder
            </p>
          </div>
          <span className="text-[10px] font-semibold text-sky-400 bg-sky-950/60 border border-sky-500/20 px-2 py-0.5 rounded">
            Auto-Sync to Google Drive
          </span>
        </div>

        <FileUploadZone onFilesChange={setAttachments} maxFiles={5} maxSizeMB={10} />
      </div>

      {/* Error Banner */}
      {submitError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Submit Action Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF & Archiving to Drive...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Work & Archive to Drive
            </>
          )}
        </button>
      </div>
    </form>
  );
}
