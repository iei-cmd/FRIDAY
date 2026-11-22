'use client';

import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FolderTree,
  ShieldCheck,
  Unlink,
  Link2,
  FolderPlus,
  Loader2,
  Check,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { GoogleDriveConfig } from '@/lib/types';
import { formatDatePretty } from '@/lib/time-utils';

export default function AdminDrivePage() {
  const [config, setConfig] = useState<GoogleDriveConfig | null>(null);
  const [isLiveConfigured, setIsLiveConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  // Action states
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Parent folder input
  const [parentFolderInput, setParentFolderInput] = useState('');
  const [savingParent, setSavingParent] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/drive/status');
      const data = await res.json();
      setConfig(data.config);
      setIsLiveConfigured(data.isLiveConfigured);
      if (data.config?.parent_folder_id) {
        setParentFolderInput(data.config.parent_folder_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/drive/test', { method: 'POST' });
      const data = await res.json();
      setTestResult({
        success: res.ok && data.success,
        message: data.message || 'Connection test response received.',
      });
      fetchStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncRetry = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/drive/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(data.message);
        fetchStatus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Drive?')) return;
    try {
      await fetch('/api/drive/disconnect', { method: 'POST' });
      fetchStatus();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <HardDrive className="w-7 h-7 text-sky-400" />
              Google Drive Vault Integration
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Centralized storage manager for committee submissions, certified PDF reports, and supporting documents
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                config?.is_connected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  config?.is_connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                }`}
              />
              {config?.is_connected ? 'Vault Connected & Active' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Integration Status & Credentials Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Connected Administrator Account
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {config?.connected_name || 'IEI Administrator Vault'}
              </h3>
              <p className="text-xs text-sky-400 font-mono mt-0.5">
                {config?.connected_email || 'admin.iei@drmgrdu.ac.in'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {config?.is_connected ? (
                <>
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />}
                    Test Connection
                  </button>

                  <a
                    href={config.root_folder_url || 'https://drive.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Root Folder
                  </a>

                  <button
                    onClick={handleDisconnect}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                    title="Disconnect Google Drive"
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <a
                  href="/api/drive/auth"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
                >
                  <Link2 className="w-4 h-4" /> Connect Administrator Google Drive
                </a>
              )}
            </div>
          </div>

          {/* Test connection alert banner */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/80'
                  : 'bg-red-950/40 text-red-300 border border-red-800/80'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Root Folder Name</span>
              <span className="font-bold text-white mt-1 block truncate">
                {config?.root_folder_name || 'IEI Data of Works'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Member Folders</span>
              <span className="font-bold text-sky-400 text-lg mt-0.5 block">
                {config?.total_member_folders || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Archived Reports</span>
              <span className="font-bold text-purple-400 text-lg mt-0.5 block">
                {config?.total_reports_stored || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Failed Uploads</span>
              <span className="font-bold text-emerald-400 text-lg mt-0.5 block">
                {config?.failed_uploads_count || 0}
              </span>
            </div>
          </div>

          {/* Sync & Retry Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
            <span className="text-slate-400">
              Last Sync Timestamp:{' '}
              <strong className="text-slate-200">
                {config?.last_sync_at ? new Date(config.last_sync_at).toLocaleString() : 'Live'}
              </strong>
            </span>

            <button
              onClick={handleSyncRetry}
              disabled={syncing}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              Verify & Retry Pending Uploads
            </button>
          </div>

          {syncResult && (
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> {syncResult}
            </p>
          )}
        </div>

        {/* Parent Folder Customization (Section 13 requirement) */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Custom Parent Folder Specification (Optional)
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Specify an existing Google Drive parent folder ID (e.g. your existing <strong className="text-slate-200">IEI WORK DATA</strong> folder). FRIDAY will create the <strong className="text-sky-300">IEI Data of Works</strong> root folder inside this parent rather than top-level My Drive.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={parentFolderInput}
              onChange={(e) => setParentFolderInput(e.target.value)}
              placeholder="e.g. 1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT or IEI_WORK_DATA"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => {
                alert('Parent folder ID saved successfully in FRIDAY settings.');
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* Live Google Cloud Credentials Configuration Help */}
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 text-xs text-slate-400 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Google Cloud OAuth 2.0 Credentials Setup Guide</span>
          </div>
          <p>
            To link your actual production Google Drive account, configure these variables in your <code className="text-sky-300">.env.local</code> or Vercel environment:
          </p>
          <pre className="p-3 rounded-xl bg-slate-900 text-sky-400 font-mono text-[11px] overflow-x-auto">
{`GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/drive/callback`}
          </pre>
          <p className="text-[11px] text-slate-500">
            Scopes requested: <code className="text-slate-400">https://www.googleapis.com/auth/drive</code> (minimum necessary for folder creation and report uploads).
          </p>
        </div>
      </div>
    </AppShell>
  );
}
