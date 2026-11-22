'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Briefcase,
  Building,
  Phone,
  Award,
  Calendar,
  Shield,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function RegisterPage() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState('');
  const [gmailAddress, setGmailAddress] = useState('');
  const [designation, setDesignation] = useState('Executive Committee Member');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [college, setCollege] = useState('Dr. M.G.R. Educational and Research Institute');
  const [ieiMembershipNo, setIeiMembershipNo] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [committeeRole, setCommitteeRole] = useState('Technical Committee Lead');
  const [dateOfJoining, setDateOfJoining] = useState('2026-11-22');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Auto-fill verified session email if available
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.session?.user?.email) {
            setGmailAddress(data.session.user.email);
            if (data.session.user.name) setFullName(data.session.user.name);
          } else {
            setGmailAddress('faculty.member@gmail.com');
          }
        }
      } catch (e) {
        setGmailAddress('faculty.member@gmail.com');
      }
    }
    checkCurrentSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !gmailAddress || !designation || !department || !mobileNumber) {
      setError('Please fill in all mandatory registration fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          gmail_address: gmailAddress,
          designation,
          department,
          college,
          iei_membership_no: ieiMembershipNo || undefined,
          mobile_number: mobileNumber,
          committee_role: committeeRole,
          date_of_joining: dateOfJoining,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration.');
      }

      setSuccessData(data);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-white">Registration Complete!</h2>
          <p className="text-xs text-slate-400">
            Welcome to FRIDAY, <strong className="text-white">{successData.member?.full_name}</strong>. Your authenticated profile has been created and your personal archive in the Administrator&apos;s Google Drive has been provisioned.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Google Drive Folder:</span>
              <span className="font-semibold text-sky-400">{successData.driveFolder?.folderPath}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Designation:</span>
              <span className="font-semibold text-white">{successData.member?.designation}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Subfolders Created:</span>
              <span className="text-emerald-400 font-medium">Work Reports • Supporting Documents • Monthly Reports</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
          >
            Go to My Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-2xl rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <Logo size="md" showSubtitle={false} showBadge={true} href="/" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Committee Member Registration
          </h2>
          <p className="text-xs text-slate-400">
            Link your authenticated Gmail to your official IEI committee posting
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-[10px] text-sky-300 font-medium mt-1">
            <Compass className="w-3 h-3 text-sky-400" />
            Institution of Engineers (India)
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name and Gmail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" />
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. K. Ramesh"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  Verified Gmail Address
                </span>
                <span className="text-[10px] text-emerald-400 font-normal">Locked (Google ID)</span>
              </label>
              <input
                type="email"
                required
                readOnly
                value={gmailAddress}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-sky-400 font-mono cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Designation and Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                Designation / Posting <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Honorary Secretary / Faculty Advisor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-400" />
                Department <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Row 3: College and Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                College / Institution
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                Mobile Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Row 4: IEI Membership No and Committee Role */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                IEI Membership No (Optional)
              </label>
              <input
                type="text"
                value={ieiMembershipNo}
                onChange={(e) => setIeiMembershipNo(e.target.value)}
                placeholder="e.g. M-1204891"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Committee Role
              </label>
              <input
                type="text"
                value={committeeRole}
                onChange={(e) => setCommitteeRole(e.target.value)}
                placeholder="e.g. Technical Committee Lead"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Date of Joining
              </label>
              <input
                type="date"
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Google Drive Provisioning Notice */}
          <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              On submission, FRIDAY automatically provisions your folder inside the Administrator&apos;s Google Drive under <strong>IEI Data of Works</strong>.
            </span>
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center font-medium">{error}</p>
          )}

          <div className="pt-2 flex items-center justify-between">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white">
              ← Back to Sign In
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Provisioning Drive Folder & Registering...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
