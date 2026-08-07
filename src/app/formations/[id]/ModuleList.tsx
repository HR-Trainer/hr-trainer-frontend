'use client';

import { useState } from 'react';
import { PlayCircle, Lock, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function ModuleList({ modules }: { modules: any[] }) {
  const [expanded, setExpanded] = useState(false);

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

        if (index === 0) {
          duration = '18 min';
        } else if (index === 1) {
          duration = '24 min';
        } else if (index === 4) {
          duration = '28 min';
        }

        return (
          <div key={module.id || index} className={`p-5 flex items-start justify-between gap-4 border-b border-slate-200 last:border-0 bg-white`}>
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0 ${index === 0 ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-400'}`}>
                {index === 0 ? <PlayCircle size={20} className="fill-[#0066FF] text-white" /> : index + 1}
              </div>
              <div>
                <h3 className={`text-[15px] font-bold mb-1.5 ${index === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{module.titre}</h3>
                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400">
                  <span className={`flex items-center gap-1 ${isReading ? 'text-emerald-500' : isQuiz ? 'text-purple-500' : 'text-[#0066FF]'}`}>
                    <Icon size={14} /> {typeText}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  {duration}
                </div>
              </div>
            </div>
            {index === 0 ? (
              <span className="text-[11px] font-bold text-[#0066FF] bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap">Free preview</span>
            ) : (
              <Lock size={16} className="text-slate-300 flex-shrink-0 mt-2" />
            )}
          </div>
        );
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
