'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, UserPlus, ShieldAlert, CheckCircle2, MoreVertical, Trash2 } from 'lucide-react';

// Faux employés pour simuler l'affichage
const MOCK_EMPLOYEES = [
  { id: 1, nom: 'Alice Dupont', email: 'alice@entreprise.com', status: 'Actif', role: 'Employé', joined: '12 Sept 2025' },
  { id: 2, nom: 'Marc Tremblay', email: 'marc@entreprise.com', status: 'Actif', role: 'Employé', joined: '14 Sept 2025' },
  { id: 3, nom: 'En attente...', email: 'nouveau@entreprise.com', status: 'Invitation envoyée', role: '-', joined: '-' },
];

export default function TeamDashboardPage() {
  const t = useTranslations('Admin');
  const [emailToInvite, setEmailToInvite] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Simuler l'appel à notre nouvelle route backend /api/b2b/invite
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/b2b/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToInvite, entrepriseId: 'test-entreprise-id' })
      });
      
      if (res.ok) {
        setMessage("L'invitation a été envoyée avec succès par email !");
        setEmailToInvite('');
      } else {
        setMessage("Erreur lors de l'envoi de l'invitation.");
      }
    } catch (error) {
      setMessage('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestion de l'Équipe</h1>
          <p className="mt-2 text-slate-500">Gérez vos employés et suivez leurs progressions.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full font-medium">
          <CheckCircle2 className="h-5 w-5" />
          Abonnement Entreprise Actif
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne de gauche : Formulaire d'invitation */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Inviter un employé</h2>
          </div>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Adresse Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  value={emailToInvite}
                  onChange={(e) => setEmailToInvite(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  placeholder="employe@entreprise.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Envoi en cours...' : "Envoyer l'invitation"}
            </button>
            {message && (
              <p className={`text-sm text-center ${message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
          
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-slate-500">
                L'employé recevra un email contenant un lien unique. En s'inscrivant via ce lien, il rejoindra automatiquement votre espace Entreprise et aura un accès gratuit.
              </p>
            </div>
          </div>
        </div>

        {/* Colonne de droite : Liste des employés */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vos Employés ({MOCK_EMPLOYEES.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date d'ajout
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                {MOCK_EMPLOYEES.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold">
                            {employee.nom.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{employee.nom}</div>
                          <div className="text-sm text-slate-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'Actif' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {employee.joined}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
