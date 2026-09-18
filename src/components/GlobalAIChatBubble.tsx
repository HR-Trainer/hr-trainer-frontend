'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, ChevronUp, Maximize2, Minimize2, Check, AlertCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';

const renderMarkdownLite = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Headers
    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-3 mb-1">{line.replace('### ', '')}</h3>;
    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
    
    // Lists
    if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc my-1">{formatInline(line.substring(2))}</li>;
    if (line.match(/^\d+\.\s/)) return <li key={i} className="ml-4 list-decimal my-1">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>;
    
    // Empty line
    if (line.trim() === '') return <br key={i} />;
    
    // Normal text
    return <p key={i} className="my-1">{formatInline(line)}</p>;
  });
};

const formatInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function GlobalAIChatBubble() {
  const { data: session } = useSession();
  const params = useParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Isolate the moduleId if the user is currently inside a module
  const moduleId = params?.moduleId as string | undefined;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && session?.user?.email) {
      const currentContextId = moduleId || 'general';
      fetch(`http://localhost:5000/api/eleve/modules/${currentContextId}/agent?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
          } else if (!moduleId) {
            setMessages([{
              role: 'AGENT',
              contenu: "Bonjour ! Je suis votre Coach IA. Posez-moi vos questions RH d'ordre général, ou ouvrez un module pour des questions spécifiques !"
            }]);
          }
        })
        .catch(err => console.error(err));
    }
  }, [isOpen, moduleId, session]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading || !session?.user?.email) return;

    const currentContextId = moduleId || 'general';

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'USER', contenu: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/eleve/modules/${currentContextId}/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, message: userMessage })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'AGENT', contenu: data.message }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'AGENT', contenu: "Erreur de connexion à l'IA. Veuillez réessayer." }]);
    } finally {
      setLoading(false);
    }
  };

  // Si on est sur l'admin ou non connecté, on ne montre pas la bulle
  if (!session || pathname?.includes('/admin')) return null;

  return (
    <>
      {/* Bouton Bulle Flottante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#0066FF] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-blue-500/50 transition-all z-50 animate-bounce group"
        >
          <Bot size={28} className="group-hover:animate-pulse" />
          {moduleId && (
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
             </span>
          )}
        </button>
      )}

      {/* Fenêtre de Chat Flottante */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#0066FF] p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Coach IA</h3>
                <p className="text-xs text-blue-200 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> En ligne
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-900">
            {messages.length === 0 && moduleId && (
              <div className="text-center text-slate-500 dark:text-slate-400 text-sm mt-10">
                <Bot size={40} className="mx-auto text-slate-300 mb-3 opacity-50" />
                Posez une question sur le contenu de ce module.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'USER' ? 'bg-[#0066FF] text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm'}`}>
                  {msg.role === 'AGENT' ? (
                    <div className="prose prose-sm prose-blue dark:prose-invert max-w-none">
                      <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-xl font-extrabold mt-4 mb-2 text-slate-800 dark:text-white flex items-center gap-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-4 mb-2 text-slate-800 dark:text-white flex items-center gap-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-[15px] font-bold mt-3 mb-1 text-slate-700 dark:text-slate-200" {...props} />,
                            p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-[14px]" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            blockquote: ({node, ...props}) => (
                              <blockquote className="border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 my-3 rounded-r-lg italic flex gap-3 text-slate-700 dark:text-slate-300">
                                <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                                <div>{props.children}</div>
                              </blockquote>
                            ),
                            hr: ({node, ...props}) => <hr className="my-4 border-slate-200 dark:border-slate-700" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                          }}
                        >
                          {msg.contenu}
                        </ReactMarkdown>
                    </div>
                  ) : (
                    msg.contenu
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm rounded-bl-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#0066FF]/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#0066FF]/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#0066FF]/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Posez votre question..."
                disabled={loading}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 text-[#0066FF] hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50 transition"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
