"use client";
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export default function ProgressChart({ data }: { data: any }) {
  const t = useTranslations('Dashboard');
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const chartData = [
    { name: 'Lun', progress: 10 },
    { name: 'Mar', progress: 15 },
    { name: 'Mer', progress: 35 },
    { name: 'Jeu', progress: 40 },
    { name: 'Ven', progress: 55 },
    { name: 'Sam', progress: 70 },
    { name: 'Dim', progress: 85 }
  ];

  const displayData = data?.historicalProgress || chartData;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = mounted && currentTheme === 'dark';
  
  const strokeColor = '#0066FF';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="bg-white dark:bg-[#111827] dark:bg-[#030712] rounded-2xl border border-slate-100 dark:border-gray-800 dark:border-gray-800 shadow-sm p-6 sm:p-8 transition-colors">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white dark:text-white mb-6">
        {t('progressChartTitle', { fallback: 'Progression de la semaine' })}
      </h2>
      
      <div className="h-72 w-full">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: textColor, fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: textColor, fontSize: 12 }} 
                domain={[0, 100]} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#0f172a' : '#fff', 
                  borderRadius: '12px',
                  border: isDark ? '1px solid #1e293b' : 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontWeight: 'bold'
                }}
                itemStyle={{ color: strokeColor }}
                formatter={(value) => [`${value}%`, 'Progression']}
              />
              <Area 
                type="monotone" 
                dataKey="progress" 
                stroke={strokeColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorProgress)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
