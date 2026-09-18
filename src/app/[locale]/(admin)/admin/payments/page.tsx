'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, Building2, User, BookOpen, Clock, Loader2 } from 'lucide-react';

interface Enrollment {
  id: string;
  createdAt: string;
  statut: string;
  progression: number;
  utilisateur: {
    id: string;
    nom: string;
    email: string;
    role: string;
    entreprise?: { nom: string } | null;
  };
  formation: {
    titre: string;
    prix: number;
  };
}

export default function AdminPayments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/payments/enrollments');
        if (!res.ok) throw new Error('Erreur lors du chargement des paiements');
        const data = await res.json();
        setEnrollments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    
  
return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#0066FF]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-200">
        {error}
      </div>
    );
  }

    const totalPages = Math.ceil(enrollments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnrollments = enrollments.slice(indexOfFirstItem, indexOfLastItem);

return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion des Paiements & Inscriptions</h1>
          <p className="text-slate-500 dark:text-gray-400">Consultez l'historique des achats (particuliers) et des employés ajoutés par les entreprises.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1f2937] border-b border-slate-200 dark:border-gray-800 text-sm font-medium text-slate-500 dark:text-gray-400">
                <th className="p-4 whitespace-nowrap">Date</th>
                <th className="p-4 whitespace-nowrap">Utilisateur</th>
                <th className="p-4 whitespace-nowrap">Type / Origine</th>
                <th className="p-4 whitespace-nowrap">Formation</th>
                <th className="p-4 whitespace-nowrap">Prix</th>
                <th className="p-4 whitespace-nowrap">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800 text-sm">
              {currentEnrollments.map((enr) => {
                const isB2B = enr.utilisateur.role === 'B2B_EMPLOYEE';
                const isEntreprise = enr.utilisateur.role === 'ENTREPRISE';
                
                return (
                  <tr key={enr.id} className="hover:bg-slate-50 dark:hover:bg-[#1f2937]/50 transition-colors">
                    <td className="p-4 text-slate-600 dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400 dark:text-gray-500" />
                        {new Date(enr.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <User size={16} className="text-slate-400 dark:text-gray-500" />
                        {enr.utilisateur.nom}
                      </div>
                      <div className="text-slate-500 dark:text-gray-400 text-xs">{enr.utilisateur.email}</div>
                    </td>
                    <td className="p-4">
                      {isB2B ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium border border-purple-200 dark:border-purple-800/50">
                          <Building2 size={14} />
                          Employé ({enr.utilisateur.entreprise?.nom || 'Inconnue'})
                        </div>
                      ) : isEntreprise ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800/50">
                          <Building2 size={14} />
                          Achat Entreprise
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-xs font-medium border border-slate-200 dark:border-gray-700">
                          <CreditCard size={14} />
                          Achat Particulier
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                        <BookOpen size={16} className="text-slate-400 dark:text-gray-500" />
                        <span className="truncate max-w-[200px] block" title={enr.formation.titre}>
                          {enr.formation.titre}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {isB2B ? (
                        <span className="text-slate-400 dark:text-gray-500 text-xs italic">Inclus (B2B)</span>
                      ) : (
                        <>{enr.formation.prix > 0 ? `${enr.formation.prix} €` : 'Gratuit'}</>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800/50">
                        Accès Validé
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-gray-400">
                    Aucun paiement ni inscription trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          
          </table>
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="text-sm text-slate-500 dark:text-gray-400">
              Affichage de {enrollments.length > 0 ? indexOfFirstItem + 1 : 0} à {Math.min(indexOfLastItem, enrollments.length)} sur {enrollments.length} éléments
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
