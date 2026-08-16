"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Link } from '@/i18n/routing';
import { BookOpen, TrendingUp, Clock, Award, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ProgressChart from '@/components/dashboard/ProgressChart';

export default function MonEspace() {
  const { data: session } = useSession();
  const t = useTranslations('Dashboard');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{nom: string, photo: string | null} | null>(null);

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

  useEffect(() => {
    const handleProfileUpdate = () => {
      if (session?.user?.email) {
        const stored = localStorage.getItem(`user_profile_${session.user.email}`);
        if (stored) {
          setUserProfile(JSON.parse(stored));
        }
      }
    };
    window.addEventListener('profile_updated', handleProfileUpdate);
    handleProfileUpdate();
    return () => window.removeEventListener('profile_updated', handleProfileUpdate);
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-[#111827] opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 text-center sm:text-left">
          <p className="text-blue-200 font-bold mb-1 flex items-center justify-center sm:justify-start gap-2">
            {t('hello')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">{userProfile?.nom || session?.user?.name}</h1>
          <p className="text-blue-100 font-medium">
            {t('activeModules1')} <span className="font-bold text-white">{data?.inscriptions?.length} {t('activeModules2')}</span>{t('activeModules3')}
          </p>
        </div>
        <div className="relative z-10 w-full sm:w-auto">
          <Link href="/mes-formations" className="flex items-center justify-center sm:justify-between gap-2 px-6 py-3 bg-white dark:bg-[#111827] text-[#0066FF] rounded-xl font-bold hover:bg-blue-50 transition w-full">
            {t('continueBtn')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0066FF] dark:text-blue-400 flex items-center justify-center mb-4">
            <BookOpen size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{data?.inscriptions?.length || 0}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{t('statEnrolled')}</div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data?.inscriptions?.length ? Math.round(data.inscriptions.reduce((acc: number, cur: any) => acc + (cur.progression || 0), 0) / data.inscriptions.length) : 0} %
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{t('statProgress')}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-500 dark:text-purple-400 flex items-center justify-center mb-4">
            <CheckCircle2 size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data?.inscriptions?.filter((i: any) => i.progression === 100)?.length || 0}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{t('statCompleted')}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-4">
            <Award size={20} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{data?.stats?.attestations || 0}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{t('statCerts')}</div>
        </div>
      </div>

      {/* Progress Chart */}
      <ProgressChart data={data} />

      {/* Formations en cours */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0066FF] dark:text-blue-400 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{t('activeCoursesTitle')}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('activeCoursesSub')}</p>
            </div>
          </div>
          <Link href="/mes-formations" className="text-sm font-bold text-[#0066FF] dark:text-blue-400 hover:underline flex items-center gap-1">
            {t('seeAll')} <ChevronRight size={16} />
          </Link>
        </div>

        <div className="space-y-6">
          {data?.availableCourses?.map((course: any, index: number) => {
            const ins = data.inscriptions?.find((i: any) => i.formationId === course.id);
            const progression = ins ? ins.progression : 0;
            const firstModuleId = course.modules?.[0]?.id;
            const linkHref = firstModuleId ? `/formations/${course.id}/modules/${firstModuleId}` : '#';
            const dateStr = ins ? new Date(ins.updatedAt).toLocaleDateString() : t('notStarted');

            return (
              <div key={course.id || index} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getIconClass(progression)} dark:bg-[#111827]`}>
                  <BookOpen size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-[15px] truncate mb-1">{course.titre}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-1">
                      <div className={`h-full rounded-full ${getColorClass(progression)}`} style={{ width: `${progression}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-8">{progression} %</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5">{t('lastUpdated')} {dateStr}</p>
                </div>

                <div className="flex-shrink-0 mt-2 sm:mt-0">
                  <Link href={linkHref} className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-[#0066FF] dark:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm">
                    {ins && progression > 0 ? t('btnResume') : t('btnStart')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t('recentActivityTitle')}</h2>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 dark:before:from-slate-800 before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
          
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            data.recentActivity.map((activity: any) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:left-1/2 -translate-x-1/2 transition-colors">
                  {activity.score !== null ? <Award size={12} /> : <CheckCircle2 size={12} />}
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] ml-8 md:ml-0 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {activity.score !== null ? `${t('quizPassed')} ${activity.score}%` : t('moduleCompleted')} <span className="text-slate-400 font-normal">— {activity.module.titre}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">{new Date(activity.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-gray-400 text-center py-4">{t('noActivity')}</p>
          )}

        </div>
      </div>

    </div>
  );
}
