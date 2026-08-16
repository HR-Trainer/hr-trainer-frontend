"use client";
import { useState } from 'react';
import { Shield, Lock, Smartphone, Globe, CheckCircle2 } from 'lucide-react';

export default function Securite() {
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Account Security</h1>
        <p className="text-slate-500 dark:text-gray-400 font-medium text-[15px]">Manage your password and login options</p>
      </div>

      {/* Security Score Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center gap-6">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-amber-200"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-amber-500"
              strokeDasharray="60, 100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-amber-600 text-sm">
            60%
          </div>
        </div>
        <div>
          <h2 className="text-amber-800 font-bold text-lg mb-1">Medium security</h2>
          <p className="text-amber-700/80 text-sm font-medium">Enable two-factor authentication to reach 100%</p>
        </div>
      </div>

      {/* Security Settings Block */}
      <div className="bg-white dark:bg-[#111827] rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-gray-800 p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-gray-800">
          <Lock size={20} className="text-[#0066FF]" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Password</h2>
        </div>

        <div className="space-y-8">
          
          {/* Password */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Current Password</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Last modified 30 days ago • Strength: <span className="font-bold text-emerald-500">Strong</span></p>
            </div>
            <button className="px-5 py-2 border border-slate-200 dark:border-gray-700 rounded-xl font-bold text-[#0066FF] text-sm hover:bg-slate-50 dark:bg-[#1f2937] transition">
              Change
            </button>
          </div>

          {/* 2FA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#1f2937] flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Not enabled — <span className="font-bold text-slate-700 dark:text-gray-200">highly recommended</span></p>
              </div>
            </div>
            {/* Toggle Switch */}
            <button 
              onClick={() => setTwoFaEnabled(!twoFaEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${twoFaEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-[#111827] transition-all ${twoFaEnabled ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>
          
          {/* Active Sessions */}
          <div className="pt-6 border-t border-slate-100 dark:border-gray-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Active Sessions</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#1f2937] flex items-center justify-center flex-shrink-0">
                    <Globe size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Chrome • macOS</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Paris, France • Right now</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold">
                  Current
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#1f2937] flex items-center justify-center flex-shrink-0">
                    <Smartphone size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Safari • iPhone</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Paris, France • 2 days ago</p>
                  </div>
                </div>
                <button className="px-3 py-1 rounded-lg border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition">
                  Revoke
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
