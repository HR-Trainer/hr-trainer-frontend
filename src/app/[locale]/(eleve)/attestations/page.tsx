"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Award, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Attestations() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const [certData, setCertData] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:5000/api/eleve/attestations?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setData({ attestations: data });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session]);

  const handleDownload = async (ins: any) => {
    setDownloading(ins.id);
    setCertData(ins);
    
    // Attendre que le DOM se mette à jour avec les données du cert
    setTimeout(async () => {
      if (certRef.current) {
        try {
          const canvas = await html2canvas(certRef.current, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          });
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Certificate_${ins.formation.titre.replace(/\s+/g, '_')}.pdf`);
        } catch (e) {
          console.error("Erreur génération PDF:", e);
        }
      }
      setDownloading(null);
    }, 500);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0066FF]" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Certificates</h1>
        <p className="text-slate-500 dark:text-gray-400 font-medium text-[15px]">Download certificates for your completed courses</p>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-gray-800 p-8">
        {data?.attestations?.length > 0 ? (
          <div className="space-y-4">
            {data.attestations.map((att: any) => (
              <div key={att.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30 transition group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">{att.formation.titre}</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-1">
                      Earned on {new Date(att.dateObtention || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDownload(att)}
                  disabled={downloading === att.id}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-700 text-[#0066FF] rounded-xl font-bold text-sm hover:bg-blue-50 hover:border-blue-200 transition disabled:opacity-50"
                >
                  {downloading === att.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 dark:bg-[#1f2937] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Award size={32} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">No certificates yet</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Complete a course to 100% to unlock your first certificate.</p>
          </div>
        )}
      </div>

      {/* Hidden Certificate Template for PDF generation */}
      <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
        {certData && (
          <div ref={certRef} className="w-[1123px] h-[794px] bg-white dark:bg-[#111827] p-[40px] box-border relative font-sans">
            <div className="w-full h-full border-[10px] border-[#0066FF] p-[40px] box-border relative flex flex-col items-center justify-center text-center">
              
              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-[15px] border-l-[15px] border-[#00bfff] -translate-x-[10px] -translate-y-[10px]"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[15px] border-r-[15px] border-[#00bfff] translate-x-[10px] translate-y-[10px]"></div>

              {/* Logo / Header */}
              <div className="absolute top-[60px] flex flex-col items-center">
                <div className="w-16 h-16 bg-[#0066FF] rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white font-black text-3xl">H</span>
                </div>
                <h2 className="text-2xl font-black tracking-widest text-slate-800 dark:text-gray-100 uppercase">HR-Trainer Academy</h2>
              </div>

              {/* Title */}
              <h1 className="text-[60px] font-black text-[#0066FF] mt-12 mb-8 uppercase tracking-widest">Certificate of Completion</h1>
              
              <p className="text-2xl text-slate-500 dark:text-gray-400 font-medium mb-6">successfully awarded to</p>
              
              {/* Name */}
              <h2 className="text-[48px] font-extrabold text-slate-900 dark:text-white mb-12 border-b-2 border-slate-200 dark:border-gray-700 pb-4 px-12 inline-block">
                {session?.user?.name || 'Learner Name'}
              </h2>
              
              <p className="text-2xl text-slate-500 dark:text-gray-400 font-medium mb-6">for attending and completing the course:</p>
              
              {/* Course */}
              <h3 className="text-[32px] font-bold text-[#0066FF] mb-16 max-w-[800px] leading-tight">
                {certData.formation.titre}
              </h3>

              {/* Footer details */}
              <div className="flex justify-between items-end w-full px-12 absolute bottom-[80px]">
                <div className="text-left">
                  <p className="text-lg text-slate-400 font-bold mb-2">Date Earned</p>
                  <p className="text-xl text-slate-800 dark:text-gray-100 font-bold border-t-2 border-slate-200 dark:border-gray-700 pt-2 w-48">
                    {new Date(certData.dateObtention || Date.now()).toLocaleDateString('en-US')}
                  </p>
                </div>
                
                <div className="w-32 h-32 bg-amber-50 rounded-full flex flex-col items-center justify-center border-4 border-amber-100 text-amber-500 relative shadow-lg">
                  <Award size={48} />
                  <span className="text-xs font-black uppercase mt-2 text-amber-600 tracking-wider">Certified</span>
                </div>

                <div className="text-right">
                  <p className="text-lg text-slate-400 font-bold mb-2">Pedagogical Director</p>
                  <div className="border-t-2 border-slate-200 dark:border-gray-700 pt-2 w-48 font-signature text-3xl text-slate-800 dark:text-gray-100">
                    M. HR-Trainer
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
