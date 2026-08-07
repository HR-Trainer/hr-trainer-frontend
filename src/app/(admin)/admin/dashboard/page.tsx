"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, BookOpen, Star, Loader2, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:5000/api/admin/dashboard?adminEmail=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 font-medium">Welcome back, Administrator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
            <Users size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Total Users</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
            <Star size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.activeUsers || 0}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Active Users</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4">
            <BookOpen size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalFormations || 0}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Total Courses</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
            <CreditCard size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.premiumUsers || 0}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Premium Subs</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Recent User Registrations</h2>
        {stats?.recentUsers && stats.recentUsers.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {stats.recentUsers.map((user: any) => (
              <div key={user.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                    {user.nom.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{user.nom}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">{user.profil === 'ENTREPRISE' ? 'Company' : 'Individual'}</div>
                  <div className="text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
}
