"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Plus, Trash2, Save, CheckCircle, Loader2 } from 'lucide-react';

export default function QuizBuilder() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<any[]>([
    { texte: '', options: [{ texte: '', estCorrecte: true }, { texte: '', estCorrecte: false }] }
  ]);

  useEffect(() => {
    fetchQuiz();
  }, [session, moduleId]);

  const fetchQuiz = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/modules/${moduleId}/quiz?adminEmail=${session.user.email}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { texte: '', options: [{ texte: '', estCorrecte: true }, { texte: '', estCorrecte: false }] }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].texte = text;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({ texte: '', estCorrecte: false });
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].texte = text;
    setQuestions(updated);
  };

  const handleSetCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.forEach((opt: any, i: number) => {
      opt.estCorrecte = i === oIndex;
    });
    setQuestions(updated);
  };

  const handleSaveQuiz = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/modules/${moduleId}/quiz?adminEmail=${session?.user?.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions })
      });
      if (res.ok) {
        router.push(`/admin/formations/${courseId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-[#0066FF]" size={32} /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl relative">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/formations/${courseId}`} className="p-2 bg-white dark:bg-[#111827] rounded-full border border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:shadow-sm transition">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Quiz Builder</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Add questions and options for this module</p>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Question {qIndex + 1}</h2>
              {questions.length > 1 && (
                <button onClick={() => handleRemoveQuestion(qIndex)} className="text-slate-400 hover:text-red-500 transition">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <input
              type="text"
              required
              placeholder="Enter question text..."
              value={q.texte}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full px-4 py-3 mb-6 border border-slate-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition font-medium text-slate-800 dark:text-gray-100"
            />

            <div className="space-y-3 pl-4 border-l-2 border-slate-100 dark:border-gray-800">
              {q.options.map((opt: any, oIndex: number) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <button
                    onClick={() => handleSetCorrectOption(qIndex, oIndex)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${opt.estCorrecte ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-green-400'}`}
                  >
                    <CheckCircle size={14} className={opt.estCorrecte ? 'text-white' : 'hidden'} />
                  </button>
                  <input
                    type="text"
                    required
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt.texte}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    className={`flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none transition ${opt.estCorrecte ? 'border-green-300 bg-green-50/30' : 'border-slate-200 dark:border-gray-700'}`}
                  />
                  {q.options.length > 2 && (
                    <button onClick={() => handleRemoveOption(qIndex, oIndex)} className="text-slate-400 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <button onClick={() => handleAddOption(qIndex)} className="mt-3 text-sm font-bold text-[#0066FF] hover:underline flex items-center gap-1">
                <Plus size={16} /> Add Option
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm sticky bottom-6">
        <button onClick={handleAddQuestion} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 dark:text-gray-200 font-bold rounded-xl hover:bg-slate-200 transition">
          <Plus size={18} /> Add New Question
        </button>
        <button disabled={saving} onClick={handleSaveQuiz} className="flex items-center gap-2 px-8 py-2.5 bg-[#0066FF] text-white font-bold rounded-xl shadow-lg shadow-[#0066FF]/20 hover:bg-blue-700 transition disabled:opacity-70">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Quiz'}
        </button>
      </div>

    </div>
  );
}
