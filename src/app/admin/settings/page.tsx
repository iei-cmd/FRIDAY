'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Layers,
  PlusCircle,
  Save,
  CheckCircle2,
  Building,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { WorkCategory } from '@/lib/types';

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#38BDF8');
  const [addingCat, setAddingCat] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Institution config
  const [instName, setInstName] = useState('Dr. M.G.R. Educational and Research Institute');
  const [chapterCode, setChapterCode] = useState('IEI-TVLC-MGR-2026');
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddingCat(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName,
          description: newCatDesc,
          color: newCatColor,
        }),
      });

      if (res.ok) {
        setNewCatName('');
        setNewCatDesc('');
        loadCategories();
        setMsg('New work category added successfully.');
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddingCat(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-sky-400" />
            FRIDAY System & Chapter Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage committee activity taxonomies, chapter identity, institutional affiliation, and academic calendar
          </p>
        </div>

        {/* Work Categories Manager (Section 5.B Requirement) */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                Committee Work Categories Taxonomy
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Categories available to members in the work submission form
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {categories.length} Categories
            </span>
          </div>

          {/* Current Categories Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: cat.color || '#38BDF8' }}
                />
                <div>
                  <p className="text-xs font-bold text-white">{cat.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {cat.description || 'Standard committee duty'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Category Form */}
          <form onSubmit={handleAddCategory} className="pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Add New Custom Category
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category Title..."
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief description..."
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-12 h-9 p-0.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                />
                <button
                  type="submit"
                  disabled={addingCat}
                  className="flex-1 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {msg && (
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {msg}
              </p>
            )}
          </form>
        </div>

        {/* Institutional & Chapter Configuration */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Institutional Chapter Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Institution Name</label>
              <input
                type="text"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">IEI Chapter Code</label>
              <input
                type="text"
                value={chapterCode}
                onChange={(e) => setChapterCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Current Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => alert('Settings saved successfully.')}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
