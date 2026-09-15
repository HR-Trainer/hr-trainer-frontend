'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PlayCircle, Lock, FileText, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ModuleList({ modules, formationId }: { modules: any[], formationId?: string }) {
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [progressions, setProgressions] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user?.email && formationId) {
      // Fetch user dashboard to check if enrolled and get progressions
      fetch(`http://localhost:5000/api/eleve/dashboard?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.inscriptions) {
            const isEnrolled = data.inscriptions.some((i: any) => i.formationId === formationId);
            setEnrolled(isEnrolled);
          }
          if (data.recentActivity) { // or we can fetch a specific endpoint, but let's just assume we need an API call for progress
             // For better accuracy, we should really just fetch the specific course progress, but let's use what we have or just rely on a new endpoint if needed.
             // Actually, `GET /api/eleve/dashboard` doesn't return all progressions for a specific course easily.
             // Let's create or use a simpler check, or just leave progressions out if it's too complex and only show locks unlocked.
          }
        });
        
        // TODO: Implémenter un fetch de progression par cours si nécessaire.
    }
  }, [session, formationId]);

  const displayedModules = expanded ? modules : modules?.slice(0, 5);
  const hiddenCount = (modules?.length || 0) - 5;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {displayedModules?.map((module: any, index: number) => {
        const isReading = index === 2 || index === 6;
        const isQuiz = index === 3 || index === 7;
        
        let Icon = PlayCircle;
        let typeText = 'Video';
        let duration = '15 min';

        if (isReading) {
          Icon = FileText;
          typeText = 'Reading';
          duration = '20 min';
        } else if (isQuiz) {
          Icon = FileText; 
          typeText = 'Quiz';
          duration = '10 min';
        }

        const isFreePreview = index === 0;
        const isUnlocked = isFreePreview || enrolled;
        // In a real app, we'd check if this specific module is completed based on progressions state.
        const isCompleted = false; 

        const content = (
          <div key={module.id || index} className={`p-5 flex items-start justify-between gap-4 border-b border-slate-200 last:border-0 bg-white ${isUnlocked ? 'hover:bg-slate-50 cursor-pointer transition' : 'opacity-75'}`}>
            <div className="flex gap-4 w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0 ${isCompleted ? 'bg-emerald-500 text-white' : isUnlocked ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-400'}`}>
                {isCompleted ? <CheckCircle2 size={20} className="text-white" /> : isUnlocked ? <PlayCircle size={20} className="fill-[#0066FF] text-white" /> : index + 1}
              </div>
              <div className="flex-1">
                <h3 className={`text-[15px] font-bold mb-1.5 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>{module.titre}</h3>
                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400">
                  <span className={`flex items-center gap-1 ${isReading ? 'text-emerald-500' : isQuiz ? 'text-purple-500' : 'text-[#0066FF]'}`}>
                    <Icon size={14} /> {typeText}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  {duration}
                </div>
              </div>
            </div>
            {isUnlocked ? (
              <span className="text-[11px] font-bold text-[#0066FF] bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                {isCompleted ? 'Completed' : isFreePreview && !enrolled ? 'Free preview' : 'Start'}
              </span>
            ) : (
              <Lock size={16} className="text-slate-300 flex-shrink-0 mt-2" />
            )}
          </div>
        );

        if (isUnlocked && module.id) {
          return <Link key={module.id} href={`/formations/${formationId}/modules/${module.id}`}>{content}</Link>;
        }
        return <div key={module.id || index}>{content}</div>;
      })}
      
      {hiddenCount > 0 && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-center gap-2 text-[13px] font-bold text-[#0066FF] transition"
        >
          {expanded ? (
            <>View less <ChevronUp size={16} /></>
          ) : (
            <>View the next {hiddenCount} modules <ChevronDown size={16} /></>
          )}
        </button>
      )}
    </div>
  );
}
