'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Mail, Plus, X, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';

export default function InviteEmployeesButton({ formationId }: { formationId: string }) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [emails, setEmails] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMsg, setResultMsg] = useState('');

  // Supprimé: if (role !== 'ENTREPRISE' && role !== 'ADMIN') return null;
  // On laisse le bouton visible pour qu'ils le trouvent, mais on peut vérifier le rôle au clic.

  const handleInvite = async () => {
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
    if (emailList.length === 0) return;

    setStatus('loading');
    setResultMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/b2b/invite-to-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: emailList,
          formationId,
          entrepriseId: (session?.user as any).id
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setResultMsg(`${data.results?.length || 0} employé(s) invité(s) avec succès !`);
        setEmails('');
        setTimeout(() => setShowModal(false), 3000);
      } else {
        setStatus('error');
        setResultMsg(data.error || 'Erreur lors de l\'invitation');
      }
    } catch (err) {
      setStatus('error');
      setResultMsg('Erreur serveur');
    }
  };

  return (
    <>
      <button 
        onClick={() => { setShowModal(true); setStatus('idle'); setResultMsg(''); }}
        className="w-full mt-3 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 py-3 rounded-xl font-bold transition"
      >
        <UserPlus size={18} /> Inviter des employés
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">Inviter à cette formation</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6">
                Saisissez les adresses emails de vos collaborateurs (séparées par des virgules). Un compte leur sera automatiquement créé avec un mot de passe temporaire s'ils n'en ont pas déjà un.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Emails des collaborateurs</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-4 text-slate-400" />
                    <textarea
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      placeholder="employe1@entreprise.com, employe2@entreprise.com..."
                      rows={4}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition resize-none custom-scrollbar"
                    />
                  </div>
                </div>

                {status === 'success' && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm font-bold">
                    <CheckCircle2 size={18} /> {resultMsg}
                  </div>
                )}

                {status === 'error' && (
                  <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl">
                    {resultMsg}
                  </div>
                )}

                <button
                  onClick={handleInvite}
                  disabled={status === 'loading' || !emails.trim()}
                  className="w-full bg-[#0066FF] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  {status === 'loading' ? 'Envoi en cours...' : 'Envoyer les invitations'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
