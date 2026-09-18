'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import EmbeddedCheckoutModal from '@/components/EmbeddedCheckoutModal';

import { useTranslations } from 'next-intl';

export default function EnrollButton({ isFree, formationId, prix }: { isFree: boolean, formationId: string, prix?: number | null }) {
  const t = useTranslations('Dashboard');
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    // Si on revient de Stripe avec un session_id, on est forcément inscrit
    if (typeof window !== 'undefined' && window.location.search.includes('session_id')) {
      setIsEnrolled(true);
    } else if (session?.user?.email) {
      fetch(`http://localhost:5000/api/eleve/dashboard?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data?.inscriptions?.some((i: any) => i.formationId === formationId)) {
            setIsEnrolled(true);
          }
        })
        .catch(err => console.error(err));
    }
  }, [session, formationId]);

  // Un employé est un utilisateur dont l'ID d'entreprise est défini, ou dont le profil est ENTREPRISE (ou accès RH)
  const isB2BEmployee = session?.user && (session.user as any).entrepriseId != null;
  const isEffectivelyFree = isFree || prix === 0 || prix === null;

  if (isEnrolled) {
    return (
      <button 
        onClick={() => router.push('/mes-formations')}
        className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[15px] py-3.5 rounded-xl hover:bg-emerald-100 transition flex items-center justify-center gap-2 shadow-sm"
      >
        <PlayCircle size={18} /> {t('continueCourse')}
      </button>
    );
  }

  const handleEnroll = async () => {
    if (!session) {
      router.push('/inscription');
      return;
    }

    if (isEffectivelyFree || isB2BEmployee) {
      // Accès gratuit
      router.push('/mon-espace');
    } else {
      // Paiement à l'acte - Embedded Checkout
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/b2b/buy-formation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            formationId, 
            utilisateurId: (session.user as any).id,
            email: session.user?.email 
          }),
        });
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          alert(data.error || 'Erreur lors de l\'initialisation du paiement.');
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
        {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
        {loading ? t('loading') : t('buyNow')}
      </button>

      {clientSecret && (
        <EmbeddedCheckoutModal 
          clientSecret={clientSecret} 
          onClose={() => setClientSecret(null)} 
        />
      )}
    </div>
  );
}
