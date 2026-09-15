'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, BellRing, FileText, CheckCircle2 } from 'lucide-react';

export default function AdminNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [prefs, setPrefs] = useState({
    nouveauxCours: true,
    email: true,
  });

  useEffect(() => {
    if (session?.user?.email) {
      // preferences from localStorage
      const savedPrefs = localStorage.getItem(`admin_prefs_${session.user.email}`);
      if (savedPrefs) {
        setPrefs(JSON.parse(savedPrefs));
      }

      // fetch real notifications
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications?email=${session?.user?.email}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email })
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePref = (key: keyof typeof prefs) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    if (session?.user?.email) {
      localStorage.setItem(`admin_prefs_${session.user.email}`, JSON.stringify(newPrefs));
    }
  };

  const unreadCount = notifications.filter(n => !n.lu).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Notifications</h1>
        <p className="text-slate-500 dark:text-gray-400 font-medium text-[15px]">Manage your system alerts and notifications</p>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-[#111827] rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-gray-800 p-8">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Unread</h2>
            <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-bold">{unreadCount}</span>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-[13px] font-bold text-[#0066FF] hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-slate-400 py-4">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-slate-400 py-4">No notifications yet.</div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => !notif.lu && markAsRead(notif.id)}
                className={`flex gap-4 group ${!notif.lu ? 'cursor-pointer' : ''}`}
              >
                <div className="mt-1 flex-shrink-0">
                  <span className="text-xl">
                    {notif.titre?.toLowerCase().includes('devis') ? '📄' : notif.titre?.toLowerCase().includes('nouveau message') ? '✉️' : notif.titre?.toLowerCase().includes('nouvel utilisateur') ? '👤' : '⚙️'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm flex items-center gap-2 ${!notif.lu ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-gray-300'}`}>
                    {notif.titre} {!notif.lu && <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                  <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-[#111827] rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-gray-800 p-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 pb-6 border-b border-slate-100 dark:border-gray-800">Notification Preferences</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">New Registrations</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">Alerts when a new user registers</p>
            </div>
            <button onClick={() => togglePref('nouveauxCours')} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.nouveauxCours ? 'bg-[#0066FF]' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-[#111827] transition-all ${prefs.nouveauxCours ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Email Digest</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">Weekly summary of platform activity</p>
            </div>
            <button onClick={() => togglePref('email')} className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.email ? 'bg-[#0066FF]' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-[#111827] transition-all ${prefs.email ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
