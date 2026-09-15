'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function EnrollButton({ isFree, formationId, prix }: { isFree: boolean, formationId: string, prix?: number | null }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Un employé est un utilisateur dont l'ID d'entreprise est défini, ou dont le profil est ENTREPRISE (ou accès RH)
  const isB2BEmployee = session?.user && (session.user as any).entrepriseId != null;
  const isEffectivelyFree = isFree || prix === 0 || prix === null;

  const handleEnroll = async () => {
    if (!session) {
      router.push('/inscription');
      return;
    }

    if (isEffectivelyFree || isB2BEmployee) {
      // Accès gratuit (soit la formation est gratuite, soit l'utilisateur est couvert par son entreprise)
      router.push('/mon-espace');
    } else {
      // Paiement à l'acte
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/b2b/buy-formation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            formationId, 
            utilisateurId: (session.user as any).id,
            email: session.user.email 
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || 'Erreur lors de la redirection vers le paiement.');
        }
      } catch (error) {
        console.error('Erreur Stripe Checkout', error);
        alert('Erreur serveur. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={handleEnroll}
        disabled={loading}
        className="w-full bg-[#0066FF] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : 
          (isEffectivelyFree || isB2BEmployee ? "S'inscrire gratuitement" : `Acheter pour ${prix || '0'} €`)
        }
        {!loading && <ArrowRight size={18} />}
      </button>
      {!session && (
        <p className="text-center text-[12px] font-bold text-slate-400 mt-4">
          Déjà un compte ? <button onClick={() => router.push('/connexion')} className="text-[#0066FF] hover:underline">Se connecter</button>
        </p>
      )}
      {session && !isFree && isB2BEmployee && (
        <p className="text-center text-[12px] font-bold text-emerald-600 mt-4 bg-emerald-50 py-1.5 rounded-md">
          ✓ Offert par votre entreprise
        </p>
      )}
    </div>
  );
}
