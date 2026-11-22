import React from 'react';
import { Trophy, Award, Medal } from 'lucide-react';

interface Contributor {
  member_name: string;
  designation: string;
  department: string;
  hours: number;
  submissions: number;
}

interface LeaderboardTableProps {
  contributors: Contributor[];
  title?: string;
}

export function LeaderboardTable({
  contributors,
  title = 'Top Committee Contributors',
}: LeaderboardTableProps) {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40 font-bold text-xs">
            <Medal className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 font-bold text-xs">
            <Award className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
        <span className="text-xs text-sky-400 font-medium">Ranked by verified hours</span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {contributors.map((c, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-3 px-2 hover:bg-slate-800/40 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              {getRankBadge(idx + 1)}
              <div>
                <p className="text-sm font-semibold text-white">{c.member_name}</p>
                <p className="text-xs text-slate-400">
                  {c.designation} • <span className="text-slate-500">{c.department}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-bold text-sky-400">{c.hours} hrs</span>
              <p className="text-[11px] text-slate-500">{c.submissions} submissions</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
