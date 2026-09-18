'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function FlouciVerifierContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const isFlouci = searchParams.get('verify_flouci');
    const utilisateurId = searchParams.get('utilisateurId');
    const formationId = searchParams.get('formationId');

    if (isFlouci && paymentId && utilisateurId && formationId && status === 'idle') {
      verifyPayment(paymentId, utilisateurId, formationId);
    }
  }, [searchParams]);

  const verifyPayment = async (payment_id: string, utilisateurId: string, formationId: string) => {
    setStatus('verifying');
    try {
      const res = await fetch('http://localhost:5000/api/b2b/verify-flouci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id, utilisateurId, formationId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setTimeout(() => {
          router.push('/mon-espace');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Le paiement n\'a pas pu être validé.');
      }
    } catch (e) {
      setStatus('error');
      setMessage('Erreur réseau lors de la vérification.');
    }
  };

  if (status === 'idle') return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in">
        {status === 'verifying' && (
          <>
            <Loader2 size={48} className="mx-auto text-[#0066FF] animate-spin mb-4" />
            <h3 className="font-bold text-lg">Vérification du paiement...</h3>
            <p className="text-sm text-slate-500 mt-2">Veuillez patienter quelques instants.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="font-bold text-lg text-emerald-600">Paiement réussi !</h3>
            <p className="text-sm text-slate-500 mt-2">Redirection vers votre espace...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="font-bold text-lg text-red-600">Erreur</h3>
            <p className="text-sm text-slate-500 mt-2">{message}</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              Fermer
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function FlouciVerifier() {
  return (
    <Suspense fallback={null}>
      <FlouciVerifierContent />
    </Suspense>
  );
}
