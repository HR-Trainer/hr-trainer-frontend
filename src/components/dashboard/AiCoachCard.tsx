import React from 'react';
import { BrainCircuit, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AiCoachCard() {
  const t = useTranslations('Dashboard');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[1.25rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden w-full relative z-10 transition-colors mt-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 p-4 pb-3 flex items-center gap-3 bg-white dark:bg-slate-900 transition-colors">
        <div className="w-10 h-10 bg-[#0066FF] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
          <BrainCircuit size={20} className="text-white" />
        </div>
        <div>
          <div className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">HR-Trainer AI Coach</div>
          <div className="text-[12px] text-emerald-500 font-bold flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> {t('online', { fallback: 'Online' })}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
        </div>
      </div>
      
      {/* Chat Body */}
      <div className="p-6 space-y-6 bg-[#f8fafc] dark:bg-slate-900/50 transition-colors">
        {/* Message AI 1 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
            <BrainCircuit size={16} className="text-white" />
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm text-[14.5px] text-slate-700 dark:text-slate-300 shadow-sm leading-relaxed max-w-[85%] transition-colors">
            {t('aiWelcomeMsg', { fallback: 'Welcome! I am your AI Coach. How can I help you with your learning path today?' })}
          </div>
        </div>

        {/* Message User */}
        <div className="flex gap-4 justify-end">
          <div className="bg-[#0066FF] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-[14.5px] font-bold shadow-md max-w-[80%] leading-relaxed">
            {t('aiUserExample', { fallback: 'Can you summarize the main points of my last module?' })}
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center mt-1 text-xs font-bold text-[#0066FF] dark:text-blue-400 transition-colors uppercase">
            U
          </div>
        </div>

        {/* Message AI 2 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
            <BrainCircuit size={16} className="text-white" />
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm transition-colors">
            <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3 transition-colors">
        <input type="text" placeholder={t('aiInputPlaceholder', { fallback: 'Ask HR-Trainer anything...' })} className="flex-grow bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-3 text-[14px] text-slate-700 dark:text-slate-300 outline-none focus:border-[#0066FF] transition-colors" />
        <button className="w-12 h-12 flex-shrink-0 bg-[#0066FF] hover:bg-blue-600 transition-colors text-white rounded-full flex items-center justify-center shadow-md">
          <Send size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
