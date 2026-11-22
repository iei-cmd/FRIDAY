'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Notification } from '@/lib/types';
import { formatDatePretty } from '@/lib/time-utils';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'POST' });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const markSingleRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-sky-400" />
              Notifications Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time submission alerts, administrative reviews, feedback, and Google Drive vault updates
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Unread ({notifications.filter((n) => !n.is_read).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden backdrop-blur-xl">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No notifications to display.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markSingleRead(n.id)}
                className={`p-5 flex items-start justify-between gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer ${
                  !n.is_read ? 'bg-sky-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${!n.is_read ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </h4>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    {n.link && (
                      <Link
                        href={n.link}
                        className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline font-semibold mt-2"
                      >
                        Navigate to action <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">
                  {formatDatePretty(n.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
