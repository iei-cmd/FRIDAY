'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Briefcase,
  Building,
  Phone,
  Award,
  Calendar,
  HardDrive,
  Save,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Shield,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { MemberProfile } from '@/lib/types';

export default function MyProfilePage() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [college, setCollege] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [ieiMembershipNo, setIeiMembershipNo] = useState('');
  const [committeeRole, setCommitteeRole] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.session?.profile) {
          const p = data.session.profile;
          setProfile(p);
          setFullName(p.full_name);
          setDesignation(p.designation);
          setDepartment(p.department);
          setCollege(p.college);
          setMobileNumber(p.mobile_number);
          setIeiMembershipNo(p.iei_membership_no || '');
          setCommitteeRole(p.committee_role);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/members/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          designation,
          department,
          college,
          mobile_number: mobileNumber,
          iei_membership_no: ieiMembershipNo || undefined,
          committee_role: committeeRole,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Profile updated successfully.');
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Member Profile & Credentials
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your committee designation, contact coordinates, and institution affiliation
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/20">
              {fullName ? fullName.substring(0, 2).toUpperCase() : 'ME'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{fullName || 'Committee Member'}</h3>
              <p className="text-xs text-sky-400 font-medium">{profile?.gmail_address}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Verified Google OAuth Identity
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" /> Verified Gmail Address
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Immutable</span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={profile?.gmail_address || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-sky-400 font-mono cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" /> Designation / Posting
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-400" /> Department
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">College / Institution</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400" /> Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-sky-400" /> IEI Membership Number
                </label>
                <input
                  type="text"
                  value={ieiMembershipNo}
                  onChange={(e) => setIeiMembershipNo(e.target.value)}
                  placeholder="e.g. M-1409218"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Committee Role</label>
                <input
                  type="text"
                  value={committeeRole}
                  onChange={(e) => setCommitteeRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Google Drive Status Bar */}
            <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="font-bold text-white block">Dedicated Google Drive Archive:</span>
                  <span className="text-slate-400 text-[11px]">
                    IEI Data of Works / {profile?.full_name || 'Member'}
                  </span>
                </div>
              </div>

              <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Connected
              </span>
            </div>

            {successMsg && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {successMsg}
              </p>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
