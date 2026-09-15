'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function MesFormations() {
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

  const getColorClass = (progression: number) => {
    if (progression > 60) return "bg-[#7B2CBF]"; 
    if (progression > 30) return "bg-[#0066FF]"; 
    return "bg-[#10B981]"; // Green
  };

  if (loading) {
    return <div className="animate-pulse flex flex-col gap-6 max-w-4xl"><div className="h-64 bg-slate-200 rounded-2xl w-full"></div></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">LEARNING</h3>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Courses</h1>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-gray-800 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">My Courses</h3>
            <p className="text-xs text-slate-400 font-medium">Track your progress</p>
          </div>
        </div>

        <div className="space-y-6">
          {data?.availableCourses?.map((course: any, idx: number) => {
            const ins = data.inscriptions?.find((i: any) => i.formationId === course.id);
            const progression = ins ? ins.progression : 0;
            const firstModuleId = course.modules?.[0]?.id;
            const linkHref = firstModuleId ? `/formations/${course.id}/modules/${firstModuleId}` : '#';

            return (
              <div key={course.id || idx} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 py-2">
                <div className="w-12 h-12 bg-slate-50 dark:bg-[#1f2937] text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-gray-800">
                  <BarChart2 size={24} />
                </div>
                
                <div className="flex-1 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">{course.titre}</h4>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex-1">
                      <div className={`h-full rounded-full ${getColorClass(progression)} transition-all duration-1000 ease-out`} style={{ width: `${progression}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-8">{progression} %</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 mt-2 md:mt-0">
                  <Link href={linkHref} className="inline-block px-5 py-2 rounded-xl text-sm font-bold text-[#0066FF] bg-white dark:bg-[#111827] border border-[#0066FF]/20 hover:bg-blue-50 hover:border-[#0066FF]/40 transition shadow-sm">
                    {ins && progression > 0 ? 'Resume' : 'Start'}
                  </Link>
                </div>
              </div>
            );
          })}
          
          {data?.availableCourses?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-gray-400 font-medium">No courses are available right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
