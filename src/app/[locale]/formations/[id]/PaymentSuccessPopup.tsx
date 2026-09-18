'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, X } from 'lucide-react';

export default function PaymentSuccessPopup({ sessionId }: { sessionId: string }) {
  const [show, setShow] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (show && sessionId) {
      // Forcer la création de l'inscription si Stripe Webhook est lent/inactif
      fetch(`http://localhost:5000/api/b2b/verify-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => console.log('Session vérifiée:', data))
        .catch(err => console.error(err));

      // Nettoyer l'URL après 5 secondes
      const timer = setTimeout(() => {
        setShow(false);
        router.replace(window.location.pathname);
        router.refresh();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, sessionId, router]);

  if (!show) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-top-10">
      <CheckCircle2 size={24} className="text-emerald-500" />
      <div>
        <h4 className="font-bold text-sm">Achat réussi avec succès !</h4>
        <p className="text-xs text-emerald-600">Vous avez maintenant accès à cette formation.</p>
      </div>
      <button onClick={() => setShow(false)} className="ml-4 text-emerald-400 hover:text-emerald-600">
        <X size={18} />
      </button>
    </div>
  );
}
