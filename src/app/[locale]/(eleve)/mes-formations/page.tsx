'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, BarChart2, CheckCircle2, PlayCircle, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function MesFormations() {
  const { data: session } = useSession();
  const t = useTranslations('Dashboard');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  const getColorClass = (progression: number) => {
    if (progression > 60) return "bg-[#7B2CBF]"; 
    if (progression > 30) return "bg-[#0066FF]"; 
    return "bg-[#10B981]";
  };

  if (loading) {
    return <div className="animate-pulse flex flex-col gap-6 max-w-5xl"><div className="h-64 bg-slate-200 rounded-2xl w-full"></div></div>;
  }

  // Filter courses that user actually has access to (only enrolled)
  const myCourses = (data?.availableCourses || []).filter((c: any) => {
    return data?.inscriptions?.some((i: any) => i.formationId === c.id);
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(myCourses.length / itemsPerPage);
  const currentCourses = myCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const CourseCard = ({ course }: { course: any }) => {
    const ins = data.inscriptions?.find((i: any) => i.formationId === course.id);
    const progression = ins ? ins.progression : 0;
    const firstModuleId = course.modules?.[0]?.id;
    const linkHref = (ins && firstModuleId) ? `/formations/${course.id}/modules/${firstModuleId}` : `/formations/${course.id}`;
    const isCompleted = progression === 100;

    return (
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 rounded-xl transition">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-[#0066FF]'} dark:bg-[#1f2937]`}>
          {isCompleted ? <CheckCircle2 size={28} /> : <BookOpen size={28} />}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{course.titre}</h4>
            {course.gratuit ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{t('free')}</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">{t('premium')}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-1 max-w-md">
              <div className={`h-full rounded-full ${getColorClass(progression)} transition-all duration-1000 ease-out`} style={{ width: `${progression}%` }}></div>
            </div>
            <span className="text-sm font-black text-slate-400 w-10">{progression} %</span>
          </div>
        </div>
        
        <div className="flex-shrink-0 mt-2 md:mt-0">
          <Link href={linkHref} className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-sm ${isCompleted ? 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50' : 'bg-[#0066FF] text-white hover:bg-blue-700'}`}>
             {isCompleted ? t('review') : (progression > 0 ? t('resume') : t('start'))} <PlayCircle size={18} />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{t('historyAndLearning')}</h3>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('myCourses')}</h1>
        <p className="text-slate-500 font-medium mt-2">{t('myCoursesDesc')}</p>
      </div>

      {myCourses.length > 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-slate-100 dark:border-gray-800 p-8">
          <div className="space-y-2">
            {currentCourses.map((c: any) => <CourseCard key={c.id} course={c} />)}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-gray-800">
              <div className="text-sm text-slate-500 dark:text-gray-400">
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, myCourses.length)} sur {myCourses.length}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

            {myCourses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">{t('noCoursesFoundTitle')}</h3>
          <p className="text-slate-500 font-medium mt-2">{t('noCoursesFoundDesc', { fallback: 'Vous n\'avez accès à aucune formation pour le moment.' })}</p>
          <Link href="/formations" className="mt-6 inline-block bg-[#0066FF] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            {t('discoverCatalog')}
          </Link>
        </div>
      )}
    </div>
  );
}
