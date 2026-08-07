"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlayCircle, FileText, CheckCircle2, MessageSquare, ChevronLeft, ChevronRight, Loader2, Play, Check, CheckSquare, Video } from 'lucide-react';

export default function LecteurModule() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  
  const formationId = params.id as string;
  const moduleId = params.moduleId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.email && moduleId) {
      fetch(`http://localhost:5000/api/eleve/modules/${moduleId}?email=${session.user.email}`)
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to fetch module');
          }
          return res.json();
        })
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setErrorMsg(err.message);
          setLoading(false);
        });
    }
  }, [session, moduleId, formationId]);

  const handleComplete = async (finalScore?: number) => {
    setSubmitting(true);
    try {
      await fetch(`http://localhost:5000/api/eleve/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email, score: finalScore })
      });
      // Update local state
      setData((prev: any) => ({
        ...prev,
        progression: { ...prev.progression, termine: true, score: finalScore ?? prev.progression?.score }
      }));
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.module?.quiz) return;

    let correctCount = 0;
    const questions = data.module.quiz.questions;
    
    questions.forEach((q: any) => {
      const selectedOptionId = quizAnswers[q.id];
      const correctOption = q.options.find((o: any) => o.estCorrecte);
      if (selectedOptionId === correctOption?.id) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setQuizSubmitted(true);
    handleComplete(calculatedScore);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0066FF]" size={32} /></div>;
  }

  if (errorMsg) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="font-medium mb-8">{errorMsg}</p>
          <Link href="/mes-formations" className="inline-flex px-6 py-3 bg-[#0066FF] text-white font-bold rounded-xl hover:bg-blue-700 transition">
            Back to my courses
          </Link>
        </div>
      </div>
    );
  }

  const moduleList = data?.module?.formation?.modules || [];
  const currentIndex = moduleList.findIndex((m: any) => m.id === moduleId);
  const prevModule = currentIndex > 0 ? moduleList[currentIndex - 1] : null;
  const nextModule = currentIndex < moduleList.length - 1 ? moduleList[currentIndex + 1] : null;
  const isTermine = data?.progression?.termine;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Breadcrumb / Top Info */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/mon-espace" className="text-slate-500 hover:text-[#0066FF] transition font-medium">Mon espace</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-500 font-medium">{data?.module?.formation?.titre || 'Formation'}</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-bold text-slate-900">{data?.module?.titre}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-bold text-slate-700 bg-white">
          <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>
          0 modules terminés
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold tracking-wider">
                <PlayCircle size={14} /> Vidéo
              </div>
              {data?.module?.duree && (
                <div className="text-sm font-medium text-slate-400">
                  ⏱ {data.module.duree} min
                </div>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{data?.module?.titre}</h1>
          </div>

          {/* Video Player */}
          <div className="bg-[#0f172a] rounded-3xl aspect-video relative overflow-hidden shadow-lg border border-slate-800 flex flex-col items-center justify-center text-center group cursor-pointer">
            {data?.module?.typeContenu === 'VIDEO' ? (
              data.module.contenuUrl ? (
                <iframe src={data.module.contenuUrl} className="w-full h-full border-0 absolute inset-0 z-10" allowFullScreen></iframe>
              ) : (
                <div className="p-8 z-0">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white mx-auto mb-6 group-hover:bg-white/20 transition">
                    <Play size={24} className="ml-1" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{data?.module?.titre}</h2>
                  <p className="text-slate-400 text-sm">{data?.module?.duree ? `${data.module.duree} min · ` : ''}Cliquez pour lancer la vidéo</p>
                </div>
              )
            ) : (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-slate-400 border border-slate-200 rounded-3xl">
                <FileText size={64} className="mb-4 text-slate-300" />
                <p>Open the document</p>
                <a href={data?.module?.contenuUrl || '#'} target="_blank" className="mt-4 px-6 py-2 bg-[#0066FF] text-white font-bold rounded-xl text-sm">Download / View</a>
              </div>
            )}
          </div>

          {/* Module Content Description */}
          <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-600 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <FileText size={16} /> CONTENU DU MODULE
            </h3>
            <div className="text-slate-600 leading-relaxed text-sm space-y-4 whitespace-pre-wrap">
              {data?.module?.description || "Le contenu de ce module s'affichera ici."}
            </div>
          </div>

          {/* Quiz Section */}
          {data?.module?.quiz && (
            <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm" id="quiz">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CheckSquare size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Quiz de validation</h2>
              </div>

              {quizSubmitted || data?.progression?.score !== null ? (
                <div className={`p-6 rounded-xl border ${score !== null && score >= 70 || (data.progression.score && data.progression.score >= 70) ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  <h3 className={`text-lg font-bold mb-2 ${score !== null && score >= 70 || (data.progression.score && data.progression.score >= 70) ? 'text-emerald-800' : 'text-red-800'}`}>
                    {score !== null && score >= 70 || (data.progression.score && data.progression.score >= 70) ? 'Félicitations !' : 'Quiz non validé'}
                  </h3>
                  <p className={`font-medium ${score !== null && score >= 70 || (data.progression.score && data.progression.score >= 70) ? 'text-emerald-600' : 'text-red-600'}`}>
                    Votre score : {score ?? data.progression.score} %
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuizSubmit} className="space-y-8">
                  {data.module.quiz.questions.map((q: any, i: number) => (
                    <div key={q.id}>
                      <h4 className="font-bold text-slate-900 mb-4">{i + 1}. {q.texte}</h4>
                      <div className="space-y-3">
                        {q.options.map((opt: any) => (
                          <label key={opt.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${quizAnswers[q.id] === opt.id ? 'border-[#0066FF] bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input 
                              type="radio" 
                              name={q.id} 
                              value={opt.id} 
                              checked={quizAnswers[q.id] === opt.id}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                              className="w-4 h-4 text-[#0066FF] border-slate-300 focus:ring-[#0066FF]" 
                              required
                            />
                            <span className={`text-sm font-medium ${quizAnswers[q.id] === opt.id ? 'text-[#0066FF]' : 'text-slate-700'}`}>{opt.texte}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={submitting} className="px-6 py-3 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-md disabled:opacity-50">
                    Valider mes réponses
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Validation Box / Complete Button */}
          {isTermine ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-700 text-sm font-bold">
              <Check size={18} /> Module validé ! Passez au suivant ou posez une question à votre coach IA.
            </div>
          ) : (
            !data?.module?.quiz && (
              <button 
                onClick={() => handleComplete()} 
                disabled={submitting}
                className="w-full py-4 bg-[#05c46b] hover:bg-[#04b060] text-white rounded-xl font-bold transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} /> Marquer comme terminé
              </button>
            )
          )}

          {/* Navigation Bottom */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {prevModule ? (
              <Link href={`/formations/${formationId}/modules/${prevModule.id}`} className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-sm font-bold text-slate-500 rounded-xl hover:bg-slate-50 transition">
                <ChevronLeft size={16} /> Précédent
              </Link>
            ) : (
              <span className="flex items-center gap-2 px-6 py-3 border border-slate-100 text-sm font-bold text-slate-300 rounded-xl">
                <ChevronLeft size={16} /> Précédent
              </span>
            )}
            
            <Link href="/mon-espace" className="text-sm font-medium text-slate-400 hover:text-slate-600 transition flex items-center gap-2">
              <FileText size={16} /> Mon tableau de bord
            </Link>

            {nextModule ? (
              <Link href={`/formations/${formationId}/modules/${nextModule.id}`} className="flex items-center gap-2 px-6 py-3 bg-[#0066FF] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm">
                Suivant <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl">
                Suivant <ChevronRight size={16} />
              </span>
            )}
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:w-80 space-y-6">
          
          {/* AI Coach */}
          <div className="bg-[#0066FF] rounded-[1.5rem] p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Coach IA disponible</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Une question sur ce module ? Votre formateur IA répond immédiatement.
            </p>
            <button className="w-full py-2.5 bg-white text-[#0066FF] rounded-xl font-bold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2">
              <MessageSquare size={16} /> Poser une question
            </button>
          </div>

          {/* Programme de la formation */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Programme de la formation</h3>
              <p className="text-xs text-slate-400 mt-1">0 / {moduleList.length} modules</p>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
              {moduleList.map((mod: any, index: number) => {
                const isActive = mod.id === moduleId;
                
                // Determine icons based on typeContenu
                let TypeIcon = Video;
                let typeLabel = "Vidéo";
                let typeColor = "text-[#0066FF]";
                let typeBg = "bg-blue-50";

                if (mod.typeContenu === 'LECTURE') {
                  TypeIcon = FileText;
                  typeLabel = "Lecture";
                  typeColor = "text-emerald-500";
                  typeBg = "bg-emerald-50";
                } else if (mod.typeContenu === 'QUIZ' || mod.quiz) {
                  typeLabel = "Quiz";
                  typeColor = "text-purple-500";
                  typeBg = "bg-purple-50";
                }

                return (
                  <Link key={mod.id} href={`/formations/${formationId}/modules/${mod.id}`} className={`flex gap-4 p-4 rounded-xl transition ${isActive ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {isActive ? (
                        <div className="w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold truncate ${isActive ? 'text-[#0066FF]' : 'text-slate-700'}`}>
                        {mod.titre}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${typeBg} ${typeColor}`}>
                          {typeLabel}
                        </span>
                        {mod.duree && (
                          <span className="text-[11px] text-slate-400 font-medium">{mod.duree} min</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
