"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, TrendingUp, Clock, Award, ChevronRight, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function MonEspace() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:5000/api/eleve/dashboard?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) {
    return <div className="animate-pulse space-y-6 max-w-5xl"><div className="h-32 bg-slate-200 rounded-2xl w-full"></div><div className="h-64 bg-slate-200 rounded-2xl w-full"></div></div>;
  }

  const getColorClass = (progression: number) => {
    if (progression > 60) return "bg-[#7B2CBF]"; // Purple
    if (progression > 30) return "bg-[#0066FF]"; // Blue
    return "bg-[#10B981]"; // Green
  };

  const getIconClass = (progression: number) => {
    if (progression > 60) return "bg-purple-50 text-[#7B2CBF]";
    if (progression > 30) return "bg-blue-50 text-[#0066FF]";
    return "bg-emerald-50 text-[#10B981]";
  };

  return (
    <div className="max-w-5xl space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-[#0066FF] rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 text-center sm:text-left">
          <p className="text-blue-200 font-bold mb-1 flex items-center justify-center sm:justify-start gap-2">
            Hello 👋
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">{session?.user?.name}</h1>
          <p className="text-blue-100 font-medium">
            You have <span className="font-bold text-white">{data?.inscriptions?.length} active modules</span>. Keep up the good work!
          </p>
        </div>
        <div className="relative z-10 w-full sm:w-auto">
          <Link href="/mes-formations" className="flex items-center justify-center sm:justify-between gap-2 px-6 py-3 bg-white text-[#0066FF] rounded-xl font-bold hover:bg-blue-50 transition w-full">
            Continue <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-4">
            <BookOpen size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900">{data?.inscriptions?.length}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Enrolled Courses</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {data?.inscriptions?.length ? Math.round(data.inscriptions.reduce((acc: number, cur: any) => acc + (cur.progression || 0), 0) / data.inscriptions.length) : 0} %
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Overall Progress</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4">
            <Clock size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900">14h</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Hours Completed</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
            <Award size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900">{data?.stats?.attestations || 0}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Certificates Earned</div>
        </div>
      </div>

      {/* Formations en cours */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Active Courses</h2>
              <p className="text-xs text-slate-500 font-medium">Pick up where you left off</p>
            </div>
          </div>
          <Link href="/mes-formations" className="text-sm font-bold text-[#0066FF] hover:underline flex items-center gap-1">
            See all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="space-y-6">
          {data?.availableCourses?.map((course: any, index: number) => {
            const ins = data.inscriptions?.find((i: any) => i.formationId === course.id);
            const progression = ins ? ins.progression : 0;
            const firstModuleId = course.modules?.[0]?.id;
            const linkHref = firstModuleId ? `/formations/${course.id}/modules/${firstModuleId}` : '#';
            const dateStr = ins ? new Date(ins.updatedAt).toLocaleDateString() : 'Not started';

            return (
              <div key={course.id || index} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getIconClass(progression)}`}>
                  <BookOpen size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-[15px] truncate mb-1">{course.titre}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex-1">
                      <div className={`h-full rounded-full ${getColorClass(progression)}`} style={{ width: `${progression}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-8">{progression} %</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5">Last updated: {dateStr}</p>
                </div>

                <div className="flex-shrink-0 mt-2 sm:mt-0">
                  <Link href={linkHref} className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-[#0066FF] bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm">
                    {ins && progression > 0 ? 'Resume' : 'Start'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h2>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
          
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            data.recentActivity.map((activity: any) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:left-1/2 -translate-x-1/2">
                  {activity.score !== null ? <Award size={12} /> : <CheckCircle2 size={12} />}
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] ml-8 md:ml-0 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-900 text-sm">
                      {activity.score !== null ? `Quiz passed with ${activity.score}%` : `Module completed`} <span className="text-slate-400 font-normal">— {activity.module.titre}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">{new Date(activity.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">No recent activity yet.</p>
          )}

        </div>
      </div>

    </div>
  );
}
