import React from 'react';

interface StatsPanelProps {
  formations: number;
  completedModules: number;
  certificates: number;
  globalProgress: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ formations, completedModules, certificates, globalProgress }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Formations */}
      <div className="p-4 bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-slate-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400">Formations</h3>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{formations}</p>
      </div>
      {/* Modules Completed */}
      <div className="p-4 bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-slate-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400">Modules Terminés</h3>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{completedModules}</p>
      </div>
      {/* Certificates */}
      <div className="p-4 bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-slate-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400">Certificats</h3>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{certificates}</p>
      </div>
      {/* Global Progress */}
      <div className="p-4 bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-slate-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400">Progression Globale</h3>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{globalProgress}%</p>
      </div>
    </div>
  );
};
