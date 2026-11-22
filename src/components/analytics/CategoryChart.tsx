'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface CategoryDataPoint {
  category: string;
  hours: number;
  count: number;
  color?: string;
}

interface CategoryChartProps {
  data: CategoryDataPoint[];
  title?: string;
}

const DEFAULT_COLORS = [
  '#38BDF8', // Sky
  '#818CF8', // Indigo
  '#34D399', // Emerald
  '#FBBF24', // Amber
  '#F472B6', // Pink
  '#A78BFA', // Purple
  '#2DD4BF', // Teal
  '#60A5FA', // Blue
  '#94A3B8', // Slate
];

export function CategoryChart({
  data,
  title = 'Work Distribution by Category',
}: CategoryChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-72 w-full rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
        Loading category breakdown...
      </div>
    );
  }

  const chartData = data.map((item, idx) => ({
    name: item.category,
    value: item.hours,
    count: item.count,
    color: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl">
      <h4 className="text-base font-bold text-white tracking-tight mb-4">{title}</h4>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-56 w-56 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any) => [`${val} hrs`, name]}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2 overflow-y-auto max-h-56 pr-2">
          {chartData.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 text-right shrink-0">
                <span className="font-semibold text-white">{item.value} hrs</span>
                <span className="text-[10px] text-slate-500">({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
