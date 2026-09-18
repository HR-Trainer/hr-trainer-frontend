'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ForcePasswordReset() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // S'il n'est pas connecté ou qu'il n'a pas besoin de reset, on redirige
  if (session && !(session.user as any)?.forcePasswordReset) {
    router.push('/mon-espace');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setErrorMsg('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 6) {
      setStatus('error');
      setErrorMsg('Le nouveau mot de passe doit faire au moins 6 caractères');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password-first-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        // Obliger l'utilisateur à se reconnecter avec son nouveau mot de passe
        setTimeout(async () => {
          await signOut({ redirect: false });
          router.push('/connexion');
        }, 3000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Erreur serveur');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-140px)] bg-[#f8fafc] dark:bg-slate-900 py-16 px-6 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck size={32} className="text-[#0066FF] dark:text-blue-400" />
          </div>
          
          <h1 className="text-2xl font-extrabold text-center text-slate-900 dark:text-white mb-2">Sécurité du compte</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
            Pour des raisons de sécurité, vous devez modifier votre mot de passe temporaire avant d'accéder à la plateforme.
          </p>

          {status === 'success' ? (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-bold text-center">
              Mot de passe mis à jour ! Redirection vers la page de connexion...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Mot de passe temporaire</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition"
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl">{errorMsg}</div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#0066FF] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50 mt-4"
              >
                {status === 'loading' ? 'Mise à jour...' : 'Enregistrer et continuer'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
