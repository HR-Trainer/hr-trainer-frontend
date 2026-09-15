'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import Link from 'next/link';

export default function AttestationsPage() {
  const { data: session } = useSession();
  const [attestations, setAttestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:5000/api/eleve/attestations?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setAttestations(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session]);

  const generatePDF = (attestation: any) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const userName = session?.user?.name || 'Étudiant';
    const courseTitle = attestation.formation.titre;
    const dateObtention = new Date(attestation.dateObtention).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    // Border
    doc.setLineWidth(2);
    doc.setDrawColor(0, 102, 255);
    doc.rect(10, 10, 277, 190);
    
    // Inner border
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, 15, 267, 180);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(0, 102, 255);
    doc.text("ATTESTATION DE RÉUSSITE", 148.5, 50, { align: 'center' });

    // Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("Décernée avec succès à", 148.5, 80, { align: 'center' });

    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(userName, 148.5, 100, { align: 'center' });

    // Course Context
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("pour avoir suivi et complété avec succès la formation :", 148.5, 120, { align: 'center' });

    // Course Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 255);
    doc.text(courseTitle, 148.5, 140, { align: 'center' });

    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Délivrée le ${dateObtention}`, 148.5, 170, { align: 'center' });

    // Signature line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(200, 175, 260, 175);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Signature du Directeur", 230, 180, { align: 'center' });

    doc.save(`Attestation_${courseTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#0066FF]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-100 text-[#0066FF] rounded-2xl flex items-center justify-center">
          <Award size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Mes Attestations</h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium text-sm">Téléchargez les certificats de vos formations terminées.</p>
        </div>
      </div>

      {attestations.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-12 text-center border border-slate-100 dark:border-gray-800 shadow-sm">
          <Award size={48} className="mx-auto text-slate-200 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-2">Aucune attestation pour le moment</h2>
          <p className="text-slate-500 dark:text-gray-400 mb-6">Vous devez terminer une formation à 100% pour débloquer son attestation.</p>
          <Link href="/mon-espace" className="inline-flex px-6 py-3 bg-[#0066FF] text-white font-bold rounded-xl shadow-lg shadow-[#0066FF]/20 hover:bg-blue-700 transition">
            Reprendre mes cours
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attestations.map((att, idx) => (
            <div key={idx} className="bg-white dark:bg-[#111827] rounded-[2rem] p-6 border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#0066FF] text-white flex items-center justify-center mb-4">
                    <Award size={18} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 leading-tight">
                    {att.formation.titre}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-6">
                    Obtenue le {new Date(att.dateObtention).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <button 
                  onClick={() => generatePDF(att)}
                  className="w-full py-3 bg-slate-50 dark:bg-[#1f2937] hover:bg-blue-50 text-[#0066FF] font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm border border-slate-100 dark:border-gray-800 hover:border-blue-100"
                >
                  <Download size={16} /> Télécharger (PDF)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
