'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star, Loader2, MessageSquare, User, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RatingSection({ formationId, evaluations = [] }: { formationId: string, evaluations: any[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const hasUserReviewed = session?.user && evaluations.some(e => e.utilisateurId === (session.user as any).id);

  const averageRating = evaluations.length > 0
    ? (evaluations.reduce((acc, curr) => acc + curr.note, 0) / evaluations.length).toFixed(1)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/connexion');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/formations/${formationId}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utilisateurId: (session.user as any).id,
          note,
          commentaire
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la soumission de l\'avis');
      
      router.refresh(); // Rafraîchit les données de la page pour afficher l'avis
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const maskName = (name: string, isEntreprise: boolean) => {
    if (isEntreprise) {
      return "Entreprise partenaire";
    }
    // "Jean Dupont" -> "J. D***" ou "Jean D."
    if (!name) return "Anonyme";
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[1][0]}.`;
    }
    return `${name.substring(0, 3)}***`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mt-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
        <div className="flex-shrink-0 text-center">
          <div className="text-5xl font-black text-slate-900">{averageRating}</div>
          <div className="flex text-yellow-400 justify-center my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={18} fill={star <= Number(averageRating) ? "currentColor" : "none"} className={star <= Number(averageRating) ? "" : "text-slate-300"} />
            ))}
          </div>
          <div className="text-sm font-bold text-slate-500">{evaluations.length} avis</div>
        </div>
        
        <div className="flex-grow w-full">
          {!hasUserReviewed && session && (
            <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Laissez votre avis</h3>
              {error && <div className="text-red-500 text-sm font-bold mb-3">{error}</div>}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold text-slate-700">Votre note :</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button type="button" key={star} onClick={() => setNote(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <Star size={24} className={star <= note ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea 
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
                placeholder="Partagez votre expérience avec cette formation..."
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition resize-none h-24 mb-3"
                required
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-[#0066FF] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                  Envoyer l'avis
                </button>
              </div>
            </form>
          )}
          {hasUserReviewed && (
             <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center gap-3 font-bold text-sm">
               <CheckCircle2 size={20} className="text-emerald-500" />
               Merci pour votre retour ! Votre avis aide les autres apprenants.
             </div>
          )}
          {!session && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <p className="text-sm font-bold text-slate-600 mb-3">Connectez-vous pour laisser un avis sur cette formation.</p>
              <button onClick={() => router.push('/connexion')} className="text-[#0066FF] font-bold hover:underline text-sm">Se connecter</button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {evaluations.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm font-bold">Aucun avis pour le moment. Soyez le premier !</div>
        ) : (
          evaluations.map((evalItem: any) => (
            <div key={evalItem.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {evalItem.utilisateur?.photo ? (
                      <img src={evalItem.utilisateur.photo} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {maskName(evalItem.utilisateur?.nom, evalItem.utilisateur?.profil === 'ENTREPRISE')}
                      {evalItem.utilisateur?.profil === 'ENTREPRISE' && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Pro</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-400">{new Date(evalItem.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={14} fill={star <= evalItem.note ? "currentColor" : "none"} className={star <= evalItem.note ? "" : "text-slate-300"} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed pl-13">
                {evalItem.commentaire}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
