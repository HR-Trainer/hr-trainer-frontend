"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Loader2, Play, AlertTriangle, BrainCircuit, Send, Mic } from 'lucide-react';

// markdown-lite renderer implementation
const renderMarkdownLite = (text: string) => {
  // bold
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // blockquotes
  formatted = formatted.replace(/^> (.*)$/gm, '<div class="bg-slate-50 text-slate-800 p-3 rounded-r-lg border-l-4 border-[#0066FF] text-sm my-2 italic">$1</div>');
  // lists
  formatted = formatted.replace(/^- (.*)$/gm, '<li class="ml-4 list-disc mb-1">$1</li>');
  // headers
  formatted = formatted.replace(/^### (.*)$/gm, '<h3 class="font-bold mt-3 mb-1 text-base text-slate-800 dark:text-white">$1</h3>');
  formatted = formatted.replace(/^## (.*)$/gm, '<h2 class="font-extrabold mt-4 mb-2 text-lg text-slate-900 dark:text-white">$1</h2>');
  // breaklines
  formatted = formatted.replace(/\n/g, '<br/>');
  
  return <div dangerouslySetInnerHTML={{ __html: formatted }} className="text-sm leading-relaxed" />;
};

interface AIChatProps {
  moduleId: string;
  sessionEmail: string | undefined;
  userName?: string;
  moduleTitle?: string;
  formationTitle?: string;
}

export default function AIChat({ moduleId, sessionEmail, userName, moduleTitle, formationTitle }: AIChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      // simulate dictation delay
      setTimeout(() => {
        setIsRecording(false);
        setInput((prev) => prev + (prev ? ' ' : '') + "Pouvez-vous m'expliquer ce concept plus en détail ?");
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (sessionEmail && moduleId) {
      fetch(`http://localhost:5000/api/eleve/modules/${moduleId}/agent?email=${sessionEmail}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data);
        })
        .catch(console.error);
    }
  }, [sessionEmail, moduleId]);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  const handleSubmit = async (userMsg?: string) => {
    const textToSend = userMsg || input.trim();
    if (!textToSend || loading || !sessionEmail) return;

    if (!userMsg) setInput('');
    setMessages(prev => [...prev, { role: 'USER', contenu: textToSend, createdAt: new Date().toISOString() }]);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/eleve/modules/${moduleId}/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sessionEmail, message: textToSend })
      });
      const resData = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'AI', contenu: resData.error || 'Erreur lors de la requête.', createdAt: new Date().toISOString() }]);
      } else {
        setMessages(prev => [...prev, resData.aiMessage]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'AI', contenu: 'Erreur réseau.', createdAt: new Date().toISOString() }]);
    }
    setLoading(false);
  };

  const handleReport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sessionEmail || messages.length === 0) return;
    setReportLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/eleve/modules/${moduleId}/agent/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sessionEmail })
      });
      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => setReportSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setReportLoading(false);
  };

  const quickPrompts = [
    "Résumez ce module en 3 points clés",
    "Expliquez-moi le concept principal",
    "Donnez-moi un exemple pratique"
  ];

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[1.25rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
      {/* Header */}
      <div 
        className="border-b border-slate-100 dark:border-slate-800 p-4 pb-3 flex items-center gap-3 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-10 h-10 bg-[#0066FF] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
          <BrainCircuit size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">Coach IA — Formateur</h3>
          <div className="text-[12px] text-emerald-500 font-bold flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> En ligne
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* signal  report */}
          <button 
            onClick={handleReport}
            disabled={reportLoading || messages.length === 0}
            className="text-[11px] font-bold px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition flex items-center gap-1 disabled:opacity-50"
          >
            {reportLoading ? <Loader2 size={12} className="animate-spin" /> : <AlertTriangle size={12} />}
            {reportSuccess ? 'Signalé ✓' : 'Signaler'}
          </button>
          
          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* collapsed preview */}
      {!isOpen && messages.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 cursor-pointer" onClick={() => setIsOpen(true)}>
          <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300 truncate">
            {messages[messages.length - 1].contenu}
          </p>
          <p className="text-xs text-slate-400 mt-1">{messages.length} messages · Cliquez pour rouvrir</p>
        </div>
      )}

      {/* expanded chat */}
      {isOpen && (
        <div className="flex flex-col h-[500px]">
          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] dark:bg-slate-900/50 space-y-6 max-h-[340px]"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-end pb-4 space-y-3">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(prompt)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-[14px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.role === 'USER';
                return (
                  <div key={idx} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
                        <BrainCircuit size={16} className="text-white" />
                      </div>
                    )}
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center mt-1 text-xs font-bold text-[#0066FF] dark:text-blue-400 transition-colors uppercase">
                        {userName ? userName.charAt(0) : 'U'}
                      </div>
                    )}
                    <div className={`max-w-[80%] relative ${isUser ? 'bg-[#0066FF] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-[14.5px] font-medium shadow-md leading-relaxed' : 'bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm text-[14.5px] text-slate-700 dark:text-slate-300 shadow-sm leading-relaxed transition-colors'}`}>
                      <div className="markdown-content">
                        {isUser ? msg.contenu : renderMarkdownLite(msg.contenu)}
                      </div>
                      <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {loading && (
              <div className="flex gap-4 flex-row">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
                  <BrainCircuit size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm transition-colors">
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* input area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors mt-auto">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              className="flex gap-3"
            >
              <button
                type="button"
                onClick={handleMicClick}
                className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all shadow-sm border ${isRecording ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'} self-end`}
                title={isRecording ? 'Arrêter l\'enregistrement' : 'Dicter avec Whisper'}
              >
                <Mic size={18} />
              </button>
              <textarea 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Posez une question sur ce module..."
                disabled={loading}
                rows={1}
                className="flex-grow bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-3 text-[14px] text-slate-700 dark:text-slate-300 outline-none focus:border-[#0066FF] transition-colors resize-none disabled:opacity-50 my-auto custom-scrollbar"
                style={{ minHeight: '46px', maxHeight: '100px' }}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="w-12 h-12 flex-shrink-0 bg-[#0066FF] hover:bg-blue-600 transition-colors text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:bg-slate-300 self-end"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
            <div className="text-[10px] text-center text-slate-400 mt-3">
              ↵ Envoyer · Shift+↵ Nouvelle ligne
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
