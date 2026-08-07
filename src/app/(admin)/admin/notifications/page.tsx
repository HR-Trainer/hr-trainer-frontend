"use client";
import { useState } from 'react';
import { Award, BellRing, FileText } from 'lucide-react';

export default function AdminNotifications() {
  const [prefs, setPrefs] = useState({
    rappels: true,
    nouveauxCours: true,
    email: true,
    sms: false
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Notifications</h1>
        <p className="text-slate-500 font-medium text-[15px]">Manage your system alerts and notifications</p>
      </div>

      {/* Unread Notifications */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">Unread</h2>
            <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-bold">2</span>
          </div>
          <button className="text-[13px] font-bold text-[#0066FF] hover:underline">Mark all as read</button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 group cursor-pointer">
            <div className="mt-1 flex-shrink-0">
              <span className="text-xl">👤</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                New User Registered <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">A new user from Acme Corp has joined the platform.</p>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">2 hours ago</span>
            </div>
          </div>

          <div className="flex gap-4 group cursor-pointer">
            <div className="mt-1 flex-shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                System Update <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">The platform will undergo maintenance at 2 AM.</p>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">1 day ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6 pb-6 border-b border-slate-100">Notification Preferences</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">New Registrations</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Alerts when a new user registers</p>
            </div>
            <button onClick={() => togglePref('nouveauxCours')} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.nouveauxCours ? 'bg-[#0066FF]' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.nouveauxCours ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Email Digest</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Weekly summary of platform activity</p>
            </div>
            <button onClick={() => togglePref('email')} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.email ? 'bg-[#0066FF]' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.email ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
