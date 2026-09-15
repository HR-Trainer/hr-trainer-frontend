'use client';

import { useTranslations } from 'next-intl';
import { Check, Zap, Shield, Users } from 'lucide-react';
import { useState } from 'react';

export default function PricingPage() {
  const t = useTranslations('Pricing');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Pour cet exemple on simule un RH connecté (normalement pris via la session NextAuth)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/b2b/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'rh@entreprise.com', // Simulé
          entrepriseId: 'test-entreprise-id' // Simulé
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur Checkout Stripe', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Tarification</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Une plateforme gratuite pour les élèves.<br />Puissante pour les entreprises.
        </p>
        <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
          Choisissez le plan qui correspond à vos besoins en matière de formation et de suivi d'équipe.
        </p>
      </div>

      <div className="mt-16 flex justify-center space-x-6 max-w-5xl mx-auto flex-col md:flex-row space-y-6 md:space-y-0">
        {/* Plan Gratuit */}
        <div className="flex flex-col rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 w-full md:w-1/2">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Individuel</h3>
          <p className="mt-4 text-slate-500">Pour les étudiants et apprenants indépendants.</p>
          <div className="mt-6 flex items-baseline text-5xl font-extrabold text-slate-900 dark:text-white">
            0€
            <span className="ml-1 text-xl font-medium text-slate-500">/mois</span>
          </div>
          <ul className="mt-8 space-y-4">
            <li className="flex items-start">
              <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700 dark:text-slate-300">Accès au catalogue de formations</p>
            </li>
            <li className="flex items-start">
              <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700 dark:text-slate-300">Chatbot Pédagogique IA</p>
            </li>
            <li className="flex items-start">
              <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700 dark:text-slate-300">Certificats de réussite</p>
            </li>
          </ul>
          <button className="mt-auto pt-8 w-full bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 font-semibold py-3 px-4 rounded-xl transition duration-200">
            Créer un compte gratuit
          </button>
        </div>

        {/* Plan Entreprise */}
        <div className="flex flex-col rounded-2xl shadow-xl border-2 border-blue-500 bg-white dark:bg-slate-900 p-8 w-full md:w-1/2 relative transform md:-translate-y-4">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-100 text-blue-600">
              Recommandé pour RH
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            Entreprise Pro <Zap className="text-blue-500 h-6 w-6" />
          </h3>
          <p className="mt-4 text-slate-500">Outils d'IA générative et gestion d'équipe pour les RH.</p>
          <div className="mt-6 flex items-baseline text-5xl font-extrabold text-slate-900 dark:text-white">
            50€
            <span className="ml-1 text-xl font-medium text-slate-500">/mois</span>
          </div>
          <ul className="mt-8 space-y-4">
            <li className="flex items-start">
              <Shield className="flex-shrink-0 h-6 w-6 text-blue-500" />
              <p className="ml-3 text-base text-slate-700 dark:text-slate-300">Tout le contenu gratuit</p>
            </li>
            <li className="flex items-start">
              <Users className="flex-shrink-0 h-6 w-6 text-blue-500" />
              <p className="ml-3 text-base text-slate-700 dark:text-slate-300">Invitations illimitées pour vos employés</p>
            </li>
            <li className="flex items-start">
              <Zap className="flex-shrink-0 h-6 w-6 text-blue-500" />
              <p className="ml-3 text-base font-semibold text-slate-900 dark:text-white">Création de formations par IA (Syllabus & Quiz)</p>
            </li>
            <li className="flex items-start">
              <Check className="flex-shrink-0 h-6 w-6 text-blue-500" />
              <p className="ml-3 text-base text-slate-700 dark:text-slate-300">Tableau de bord de suivi (Analytics)</p>
            </li>
          </ul>
          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="mt-auto pt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 flex justify-center items-center gap-2"
          >
            {loading ? 'Chargement sécurisé...' : "S'abonner avec Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
}
