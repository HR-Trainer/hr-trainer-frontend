"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, BellRing, FileText } from 'lucide-react';

export default function Notifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [prefs, setPrefs] = useState({
    rappels: true,
    nouveauxCours: true,
    email: true,
    sms: false
  });

  useEffect(() => {
    if (session?.user?.email) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications?email=${session?.user?.email}`);
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:5000/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email })
      });
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
        <p className="text-slate-500 font-medium text-[15px]">Choose how you want to be contacted</p>
      </div>

      {/* Unread Notifications */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">Unread</h2>
            <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-bold">{notifications.filter(n => !n.lu).length}</span>
          </div>
          <button onClick={markAllAsRead} className="text-[13px] font-bold text-[#0066FF] hover:underline">Mark all as read</button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-slate-100 rounded-lg"></div>
              <div className="h-12 bg-slate-100 rounded-lg"></div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-slate-500">No notifications.</p>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} onClick={() => !notif.lu && markAsRead(notif.id)} className={`flex gap-4 group cursor-pointer ${notif.lu ? 'opacity-60' : ''}`}>
                <div className="mt-1 flex-shrink-0">
                  <span className="text-xl">
                    {notif.titre.toLowerCase().includes('congratulations') ? '🎉' : notif.titre.toLowerCase().includes('course') ? '📚' : '🔔'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {notif.titre} {!notif.lu && <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
                  <span className="text-[11px] font-medium text-slate-400 mt-1 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6 pb-6 border-b border-slate-100">Notification Preferences</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Course Reminders</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">When you haven't made progress for 3 days</p>
            </div>
            <button onClick={() => togglePref('rappels')} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.rappels ? 'bg-[#0066FF]' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.rappels ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">New Courses</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Alerts when a new course is available</p>
            </div>
            <button onClick={() => togglePref('nouveauxCours')} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.nouveauxCours ? 'bg-[#0066FF]' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.nouveauxCours ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Email Notifications</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Weekly summary of your progress</p>
            </div>
            <button onClick={() => togglePref('email')} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.email ? 'bg-[#0066FF]' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.email ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">SMS Notifications</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Urgent reminders via SMS</p>
            </div>
            <button onClick={() => togglePref('sms')} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.sms ? 'bg-[#0066FF]' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.sms ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
