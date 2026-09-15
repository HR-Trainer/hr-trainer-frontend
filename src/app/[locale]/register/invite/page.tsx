'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Building2, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function InvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<{ email: string, nomEntreprise: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      // Vérifier le token auprès du backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/b2b/invite/${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setInviteData(data);
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Erreur de connexion au serveur.');
          setLoading(false);
        });
    } else {
      setError("Lien d'invitation invalide.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 text-center border border-red-100 dark:border-red-900/30">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invitation Invalide</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
          <Link href="/" className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 dark:bg-blue-900/30 border-4 border-blue-100 dark:border-blue-900/50 mb-6">
            <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Bienvenue sur HR-Trainer
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Vous avez été invité par <span className="font-semibold text-blue-600 dark:text-blue-400">{inviteData?.nomEntreprise}</span> à rejoindre leur espace de formation.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mt-8 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <p className="text-sm text-slate-700 dark:text-slate-300">Accès 100% pris en charge par votre entreprise.</p>
          </div>
          <div className="flex items-center gap-4">
            <UserPlus className="h-6 w-6 text-blue-500" />
            <p className="text-sm text-slate-700 dark:text-slate-300">Votre compte sera associé à <b>{inviteData?.email}</b>.</p>
          </div>
        </div>

        <form className="mt-8 space-y-6" action="#" method="POST">
          {/* Champs de création de mot de passe et nom */}
          <div className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nom complet</label>
              <input id="nom" name="nom" type="text" required className="mt-1 block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Jean Dupont" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Créer un mot de passe</label>
              <input id="password" name="password" type="password" required className="mt-1 block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg">
            Créer mon compte et rejoindre
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}

import { ShieldAlert } from 'lucide-react';
